import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCalendarEntryDto } from './dto/create-calendar-entry.dto';
import { UpdateCalendarEntryDto } from './dto/update-calendar-entry.dto';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDto: CreateCalendarEntryDto) {
    return this.prisma.calendarEntry.create({
      data: {
        ...createDto,
        userId,
        date: new Date(createDto.date),
      },
      include: {
        template: true,
      },
    });
  }

  async findAll(userId: string, startDate?: Date, endDate?: Date) {
    return this.prisma.calendarEntry.findMany({
      where: {
        userId,
        ...(startDate &&
          endDate && {
            date: {
              gte: startDate,
              lte: endDate,
            },
          }),
      },
      include: {
        template: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async update(id: string, userId: string, updateDto: UpdateCalendarEntryDto) {
    return this.prisma.calendarEntry.updateMany({
      where: {
        id,
        userId,
      },
      data: updateDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.prisma.calendarEntry.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }
}
