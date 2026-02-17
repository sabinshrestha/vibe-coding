import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(userId: string) {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get weekly volume
    const weeklySessions = await this.prisma.workoutSession.findMany({
      where: {
        userId,
        isCompleted: true,
        completedAt: {
          gte: weekAgo,
        },
      },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
      },
    });

    const weeklyVolume = weeklySessions.reduce((total, session) => {
      return (
        total +
        session.exercises.reduce((sessionTotal, exercise) => {
          return (
            sessionTotal +
            exercise.sets.reduce((setTotal, set) => {
              return setTotal + (set.volume || 0);
            }, 0)
          );
        }, 0)
      );
    }, 0);

    // Get current streak
    const allCompletedSessions = await this.prisma.workoutSession.findMany({
      where: {
        userId,
        isCompleted: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
      select: {
        completedAt: true,
      },
    });

    let currentStreak = 0;
    let lastDate: Date | null = null;

    for (const session of allCompletedSessions) {
      if (!session.completedAt) continue;

      const sessionDate = new Date(session.completedAt);
      sessionDate.setHours(0, 0, 0, 0);

      if (!lastDate) {
        lastDate = sessionDate;
        currentStreak = 1;
      } else {
        const dayDiff = Math.floor(
          (lastDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (dayDiff === 1) {
          currentStreak++;
          lastDate = sessionDate;
        } else if (dayDiff > 1) {
          break;
        }
      }
    }

    // Total workouts
    const totalWorkouts = await this.prisma.workoutSession.count({
      where: {
        userId,
        isCompleted: true,
      },
    });

    // Current weight
    const latestWeight = await this.prisma.bodyMetric.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    // Recent PRs
    const recentPRs = await this.prisma.workoutSessionSet.findMany({
      where: {
        isPR: true,
        sessionExercise: {
          session: {
            userId,
          },
        },
      },
      include: {
        sessionExercise: {
          include: {
            exercise: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    return {
      weeklyVolume: Math.round(weeklyVolume),
      currentStreak,
      totalWorkouts,
      currentWeight: latestWeight?.weight,
      recentPRs: recentPRs.map((pr) => ({
        exerciseId: pr.sessionExercise.exerciseId,
        exerciseName: pr.sessionExercise.exercise.name,
        bestWeight: pr.actualWeight || 0,
        bestReps: pr.actualReps || 0,
        bestEstimated1RM: pr.estimated1RM || 0,
        bestVolume: pr.volume || 0,
        achievedAt: pr.createdAt,
      })),
    };
  }

  async getVolumeData(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sessions = await this.prisma.workoutSession.findMany({
      where: {
        userId,
        isCompleted: true,
        completedAt: {
          gte: startDate,
        },
      },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
      },
      orderBy: {
        completedAt: 'asc',
      },
    });

    return sessions.map((session) => ({
      date: session.completedAt,
      volume: session.exercises.reduce((total, exercise) => {
        return (
          total +
          exercise.sets.reduce((setTotal, set) => {
            return setTotal + (set.volume || 0);
          }, 0)
        );
      }, 0),
    }));
  }

  async getOneRMData(userId: string, exerciseId?: string) {
    const where: any = {
      sessionExercise: {
        session: {
          userId,
          isCompleted: true,
        },
        ...(exerciseId && { exerciseId }),
      },
      estimated1RM: {
        not: null,
      },
    };

    const sets = await this.prisma.workoutSessionSet.findMany({
      where,
      include: {
        sessionExercise: {
          include: {
            exercise: true,
            session: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return sets.map((set) => ({
      date: set.sessionExercise.session.completedAt || set.createdAt,
      exerciseId: set.sessionExercise.exerciseId,
      exerciseName: set.sessionExercise.exercise.name,
      estimated1RM: set.estimated1RM || 0,
    }));
  }

  async getPersonalRecords(userId: string) {
    // Get all exercises user has performed
    const exerciseIds = await this.prisma.workoutSessionExercise.findMany({
      where: {
        session: {
          userId,
          isCompleted: true,
        },
      },
      select: {
        exerciseId: true,
        exercise: true,
      },
      distinct: ['exerciseId'],
    });

    const prs = await Promise.all(
      exerciseIds.map(async ({ exerciseId, exercise }) => {
        const bestSet = await this.prisma.workoutSessionSet.findFirst({
          where: {
            sessionExercise: {
              exerciseId,
              session: {
                userId,
                isCompleted: true,
              },
            },
            estimated1RM: {
              not: null,
            },
          },
          orderBy: {
            estimated1RM: 'desc',
          },
        });

        if (!bestSet) return null;

        const bestVolumeSet = await this.prisma.workoutSessionSet.findFirst({
          where: {
            sessionExercise: {
              exerciseId,
              session: {
                userId,
                isCompleted: true,
              },
            },
            volume: {
              not: null,
            },
          },
          orderBy: {
            volume: 'desc',
          },
        });

        return {
          exerciseId,
          exerciseName: exercise.name,
          bestWeight: bestSet.actualWeight || 0,
          bestReps: bestSet.actualReps || 0,
          bestEstimated1RM: bestSet.estimated1RM || 0,
          bestVolume: bestVolumeSet?.volume || 0,
          achievedAt: bestSet.createdAt,
        };
      })
    );

    return prs.filter((pr) => pr !== null);
  }

  async getBodyMetrics(userId: string) {
    return this.prisma.bodyMetric.findMany({
      where: { userId },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async createBodyMetric(userId: string, data: any) {
    return this.prisma.bodyMetric.create({
      data: {
        ...data,
        userId,
        date: new Date(data.date),
      },
    });
  }
}
