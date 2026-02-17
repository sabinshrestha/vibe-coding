import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private emailService: EmailService,
    private usersService: UsersService
  ) {}

  async register(registerDto: RegisterDto): Promise<LoginResponseDto> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await argon2.hash(registerDto.password);

    // Get athlete role
    let athleteRole = await this.prisma.role.findUnique({ where: { name: 'ATHLETE' } });
    if (!athleteRole) {
      athleteRole = await this.prisma.role.create({ data: { name: 'ATHLETE' } });
    }

    // Create user with profile
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        roles: {
          create: {
            roleId: athleteRole.id,
          },
        },
        profile: {
          create: {
            units: 'IMPERIAL',
            experienceLevel: 'BEGINNER',
          },
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        details: { email: user.email },
      },
    });

    // Send welcome email
    await this.emailService.sendWelcomeEmail(user.email, user.name);

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.roles.map((r) => r.role.name));

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: await this.usersService.findById(user.id),
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    return user;
  }

  async login(user: any): Promise<LoginResponseDto> {
    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.roles.map((r) => r.role.name)
    );

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGGED_IN',
        details: { email: user.email },
      },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: await this.usersService.findById(user.id),
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Check if refresh token exists in database
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: {
        user: {
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (tokenRecord.expiresAt < new Date()) {
      await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
      throw new UnauthorizedException('Refresh token expired');
    }

    // Delete old refresh token
    await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });

    // Generate new tokens
    const tokens = await this.generateTokens(
      tokenRecord.user.id,
      tokenRecord.user.email,
      tokenRecord.user.roles.map((r) => r.role.name)
    );

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId: tokenRecord.user.id,
        action: 'TOKEN_REFRESHED',
      },
    });

    return tokens;
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    // Delete refresh token
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
        token: refreshToken,
      },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'USER_LOGGED_OUT',
      },
    });
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't reveal if user exists
      return;
    }

    // Generate reset token
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // Send reset email
    await this.emailService.sendPasswordResetEmail(user.email, token);

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'PASSWORD_RESET_REQUESTED',
      },
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken || resetToken.isUsed) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    // Hash new password
    const hashedPassword = await argon2.hash(newPassword);

    // Update password
    await this.prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Mark token as used
    await this.prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { isUsed: true },
    });

    // Delete all refresh tokens for this user
    await this.prisma.refreshToken.deleteMany({
      where: { userId: resetToken.userId },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId: resetToken.userId,
        action: 'PASSWORD_RESET_COMPLETED',
      },
    });
  }

  private async generateTokens(
    userId: string,
    email: string,
    roles: string[]
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email, roles };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = uuidv4();
    const refreshExpiresAt = new Date();
    const refreshDays = parseInt(process.env.JWT_REFRESH_EXPIRES_IN?.replace('d', '') || '7', 10);
    refreshExpiresAt.setDate(refreshExpiresAt.getDate() + refreshDays);

    // Store refresh token in database
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: refreshExpiresAt,
      },
    });

    return { accessToken, refreshToken };
  }
}
