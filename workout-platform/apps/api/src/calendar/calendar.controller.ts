import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { CalendarService } from './calendar.service';
import { CreateCalendarEntryDto } from './dto/create-calendar-entry.dto';
import { UpdateCalendarEntryDto } from './dto/update-calendar-entry.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestUser } from '../common/types/request-user.type';

@ApiTags('calendar')
@ApiBearerAuth()
@Controller('calendar')
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Post()
  @ApiOperation({ summary: 'Create calendar entry' })
  async create(@CurrentUser() user: RequestUser, @Body() createDto: CreateCalendarEntryDto) {
    const data = await this.calendarService.create(user.id, createDto);
    return { success: true, data };
  }

  @Get()
  @ApiOperation({ summary: 'Get calendar entries' })
  async findAll(
    @CurrentUser() user: RequestUser,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const data = await this.calendarService.findAll(
      user.id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
    return { success: true, data };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update calendar entry' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
    @Body() updateDto: UpdateCalendarEntryDto
  ) {
    const data = await this.calendarService.update(id, user.id, updateDto);
    return { success: true, data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete calendar entry' })
  async remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    await this.calendarService.remove(id, user.id);
    return { success: true };
  }
}
