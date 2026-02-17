import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StartSessionDto } from './dto/start-session.dto';
import { LogSetDto } from './dto/log-set.dto';
import { CompleteSessionDto } from './dto/complete-session.dto';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async startSession(userId: string, startSessionDto: StartSessionDto) {
    const { templateId, exercises } = startSessionDto;

    let templateData = undefined;
    if (templateId) {
      templateData = await this.prisma.workoutTemplate.findUnique({
        where: { id: templateId },
        include: {
          exercises: {
            include: {
              sets: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
    }

    const session = await this.prisma.workoutSession.create({
      data: {
        userId,
        templateId: templateId || null,
        exercises: {
          create:
            exercises?.map((ex, index) => ({
              exerciseId: ex.exerciseId,
              order: index,
              notes: ex.notes,
              sets: {
                create: ex.sets?.map((set, setIndex) => ({
                  setNumber: setIndex + 1,
                  actualReps: set.actualReps,
                  actualWeight: set.actualWeight,
                  actualRpe: set.actualRpe,
                  notes: set.notes,
                })) || [],
              },
            })) ||
            templateData?.exercises.map((ex) => ({
              exerciseId: ex.exerciseId,
              order: ex.order,
              notes: ex.notes,
              sets: {
                create: ex.sets.map((set) => ({
                  setNumber: set.setNumber,
                })),
              },
            })) ||
            [],
        },
      },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return session;
  }

  async logSet(sessionId: string, exerciseId: string, setNumber: number, logSetDto: LogSetDto) {
    const sessionExercise = await this.prisma.workoutSessionExercise.findFirst({
      where: {
        sessionId,
        exerciseId,
      },
    });

    if (!sessionExercise) {
      throw new NotFoundException('Exercise not found in session');
    }

    // Calculate volume and estimated 1RM
    const volume =
      logSetDto.actualReps && logSetDto.actualWeight
        ? logSetDto.actualReps * logSetDto.actualWeight
        : null;

    // Epley formula: 1RM = weight * (1 + reps / 30)
    const estimated1RM =
      logSetDto.actualReps && logSetDto.actualWeight
        ? logSetDto.actualWeight * (1 + logSetDto.actualReps / 30)
        : null;

    // Check if this is a PR
    let isPR = false;
    if (estimated1RM) {
      const bestPrevious = await this.prisma.workoutSessionSet.findFirst({
        where: {
          sessionExercise: {
            exerciseId,
            session: {
              userId: (
                await this.prisma.workoutSession.findUnique({ where: { id: sessionId } })
              )?.userId,
            },
          },
          estimated1RM: { not: null },
        },
        orderBy: {
          estimated1RM: 'desc',
        },
      });

      isPR = !bestPrevious || (estimated1RM > (bestPrevious.estimated1RM || 0));
    }

    const set = await this.prisma.workoutSessionSet.upsert({
      where: {
        sessionExerciseId_setNumber: {
          sessionExerciseId: sessionExercise.id,
          setNumber,
        },
      },
      update: {
        ...logSetDto,
        volume,
        estimated1RM,
        isPR,
      },
      create: {
        sessionExerciseId: sessionExercise.id,
        setNumber,
        ...logSetDto,
        volume,
        estimated1RM,
        isPR,
      },
    });

    return set;
  }

  async completeSession(sessionId: string, userId: string, completeSessionDto: CompleteSessionDto) {
    const session = await this.prisma.workoutSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const duration = Math.floor((new Date().getTime() - session.startedAt.getTime()) / 1000);

    return this.prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        duration,
        notes: completeSessionDto.notes,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async findAll(userId: string, startDate?: Date, endDate?: Date) {
    return this.prisma.workoutSession.findMany({
      where: {
        userId,
        ...(startDate &&
          endDate && {
            startedAt: {
              gte: startDate,
              lte: endDate,
            },
          }),
      },
      include: {
        template: true,
        exercises: {
          include: {
            exercise: true,
            sets: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const session = await this.prisma.workoutSession.findUnique({
      where: { id },
      include: {
        template: true,
        exercises: {
          include: {
            exercise: true,
            sets: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!session || session.userId !== userId) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async deleteSession(id: string, userId: string) {
    const session = await this.findOne(id, userId);

    await this.prisma.workoutSession.delete({ where: { id } });
  }
}
