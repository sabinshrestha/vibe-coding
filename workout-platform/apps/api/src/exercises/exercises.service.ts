import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { FilterExercisesDto } from './dto/filter-exercises.dto';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createExerciseDto: CreateExerciseDto) {
    return this.prisma.exercise.create({
      data: {
        ...createExerciseDto,
        createdById: userId,
      },
    });
  }

  async findAll(filterDto: FilterExercisesDto) {
    const { q, muscle, equipment, tag, sort, page = 1, pageSize = 50 } = filterDto;

    const where: any = {
      OR: [{ isGlobal: true, isApproved: true }, { createdById: filterDto.userId }],
    };

    if (q) {
      where.name = { contains: q, mode: 'insensitive' };
    }

    if (muscle) {
      where.muscleGroups = { has: muscle };
    }

    if (equipment) {
      where.equipment = { has: equipment };
    }

    if (tag) {
      where.tags = {
        some: {
          tag: {
            name: tag,
          },
        },
      };
    }

    const [data, totalCount] = await Promise.all([
      this.prisma.exercise.findMany({
        where,
        orderBy: sort === 'name' ? { name: 'asc' } : { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.exercise.count({ where }),
    ]);

    return {
      data,
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }

  async findOne(id: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    return exercise;
  }

  async update(id: string, userId: string, updateExerciseDto: UpdateExerciseDto) {
    const exercise = await this.findOne(id);

    if (exercise.createdById !== userId && !exercise.isGlobal) {
      throw new ForbiddenException('Cannot update this exercise');
    }

    return this.prisma.exercise.update({
      where: { id },
      data: updateExerciseDto,
    });
  }

  async remove(id: string, userId: string) {
    const exercise = await this.findOne(id);

    if (exercise.createdById !== userId) {
      throw new ForbiddenException('Cannot delete this exercise');
    }

    await this.prisma.exercise.delete({ where: { id } });
  }
}
