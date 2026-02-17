import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTemplateDto: CreateTemplateDto) {
    const { exercises, ...templateData } = createTemplateDto;

    return this.prisma.workoutTemplate.create({
      data: {
        ...templateData,
        createdById: userId,
        exercises: {
          create: exercises.map((ex, index) => ({
            exerciseId: ex.exerciseId,
            order: index,
            notes: ex.notes,
            sets: {
              create: ex.sets.map((set, setIndex) => ({
                setNumber: setIndex + 1,
                ...set,
              })),
            },
          })),
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
  }

  async findAll(userId: string) {
    return this.prisma.workoutTemplate.findMany({
      where: {
        createdById: userId,
        isArchived: false,
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
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const template = await this.prisma.workoutTemplate.findUnique({
      where: { id },
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

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    if (template.createdById !== userId) {
      throw new ForbiddenException('Cannot access this template');
    }

    return template;
  }

  async update(id: string, userId: string, updateTemplateDto: UpdateTemplateDto) {
    await this.findOne(id, userId);

    const { exercises, ...templateData } = updateTemplateDto;

    if (exercises) {
      // Delete existing exercises and create new ones
      await this.prisma.workoutTemplateExercise.deleteMany({
        where: { templateId: id },
      });

      return this.prisma.workoutTemplate.update({
        where: { id },
        data: {
          ...templateData,
          exercises: {
            create: exercises.map((ex, index) => ({
              exerciseId: ex.exerciseId,
              order: index,
              notes: ex.notes,
              sets: {
                create: ex.sets.map((set, setIndex) => ({
                  setNumber: setIndex + 1,
                  ...set,
                })),
              },
            })),
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
    }

    return this.prisma.workoutTemplate.update({
      where: { id },
      data: templateData,
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

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    // Soft delete by archiving
    await this.prisma.workoutTemplate.update({
      where: { id },
      data: { isArchived: true },
    });
  }

  async duplicate(id: string, userId: string) {
    const original = await this.findOne(id, userId);

    return this.prisma.workoutTemplate.create({
      data: {
        name: `${original.name} (Copy)`,
        description: original.description,
        createdById: userId,
        exercises: {
          create: original.exercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            order: ex.order,
            notes: ex.notes,
            sets: {
              create: ex.sets.map((set) => ({
                setNumber: set.setNumber,
                targetReps: set.targetReps,
                targetWeight: set.targetWeight,
                targetRpe: set.targetRpe,
                restTime: set.restTime,
                tempo: set.tempo,
                notes: set.notes,
                groupId: set.groupId,
              })),
            },
          })),
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
  }
}
