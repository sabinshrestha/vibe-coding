import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        profile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async changeUserRole(userId: string, roleNames: string[]) {
    // Delete existing roles
    await this.prisma.userRole.deleteMany({
      where: { userId },
    });

    // Get role IDs
    const roles = await this.prisma.role.findMany({
      where: {
        name: {
          in: roleNames,
        },
      },
    });

    // Create new role assignments
    await this.prisma.userRole.createMany({
      data: roles.map((role) => ({
        userId,
        roleId: role.id,
      })),
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'ROLE_CHANGED',
        details: { newRoles: roleNames },
      },
    });

    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async getPendingExercises() {
    return this.prisma.exercise.findMany({
      where: {
        isGlobal: true,
        isApproved: false,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async approveExercise(exerciseId: string) {
    await this.prisma.exercise.update({
      where: { id: exerciseId },
      data: { isApproved: true },
    });

    // Create audit log
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (exercise) {
      await this.prisma.auditLog.create({
        data: {
          userId: exercise.createdById,
          action: 'EXERCISE_MODERATED',
          details: { exerciseId, status: 'approved' },
        },
      });
    }
  }

  async rejectExercise(exerciseId: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    await this.prisma.exercise.delete({
      where: { id: exerciseId },
    });

    // Create audit log
    if (exercise) {
      await this.prisma.auditLog.create({
        data: {
          userId: exercise.createdById,
          action: 'EXERCISE_MODERATED',
          details: { exerciseId, status: 'rejected' },
        },
      });
    }
  }

  async getAuditLogs(limit: number = 100) {
    return this.prisma.auditLog.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }
}
