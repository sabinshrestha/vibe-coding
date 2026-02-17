import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestUser } from '../common/types/request-user.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() registerDto: RegisterDto): Promise<{ success: boolean; data: LoginResponseDto }> {
    const data = await this.authService.register(registerDto);
    return { success: true, data };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Req() req, @Body() loginDto: LoginDto): Promise<{ success: boolean; data: LoginResponseDto }> {
    const data = await this.authService.login(req.user);
    return { success: true, data };
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<{ success: boolean; data: any }> {
    const data = await this.authService.refreshToken(refreshTokenDto.refreshToken);
    return { success: true, data };
  }

  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  async logout(
    @CurrentUser() user: RequestUser,
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<{ success: boolean }> {
    await this.authService.logout(user.id, refreshTokenDto.refreshToken);
    return { success: true };
  }

  @Public()
  @Post('request-password-reset')
  @ApiOperation({ summary: 'Request password reset email' })
  async requestPasswordReset(@Body() dto: RequestPasswordResetDto): Promise<{ success: boolean }> {
    await this.authService.requestPasswordReset(dto.email);
    return { success: true };
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ success: boolean }> {
    await this.authService.resetPassword(dto.token, dto.newPassword);
    return { success: true };
  }

  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: RequestUser): Promise<{ success: boolean; data: any }> {
    return { success: true, data: user };
  }
}
