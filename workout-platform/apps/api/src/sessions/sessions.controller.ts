import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { SessionsService } from './sessions.service';
import { StartSessionDto } from './dto/start-session.dto';
import { LogSetDto } from './dto/log-set.dto';
import { CompleteSessionDto } from './dto/complete-session.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestUser } from '../common/types/request-user.type';

@ApiTags('sessions')
@ApiBearerAuth()
@Controller('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a new workout session' })
  async startSession(@CurrentUser() user: RequestUser, @Body() startSessionDto: StartSessionDto) {
    const data = await this.sessionsService.startSession(user.id, startSessionDto);
    return { success: true, data };
  }

  @Post(':sessionId/exercises/:exerciseId/sets/:setNumber')
  @ApiOperation({ summary: 'Log a set in an active session' })
  async logSet(
    @Param('sessionId') sessionId: string,
    @Param('exerciseId') exerciseId: string,
    @Param('setNumber') setNumber: string,
    @Body() logSetDto: LogSetDto
  ) {
    const data = await this.sessionsService.logSet(sessionId, exerciseId, parseInt(setNumber), logSetDto);
    return { success: true, data };
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete a workout session' })
  async completeSession(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
    @Body() completeSessionDto: CompleteSessionDto
  ) {
    const data = await this.sessionsService.completeSession(id, user.id, completeSessionDto);
    return { success: true, data };
  }

  @Get()
  @ApiOperation({ summary: 'Get all sessions' })
  async findAll(
    @CurrentUser() user: RequestUser,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const data = await this.sessionsService.findAll(
      user.id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get session by ID' })
  async findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    const data = await this.sessionsService.findOne(id, user.id);
    return { success: true, data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete session' })
  async deleteSession(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    await this.sessionsService.deleteSession(id, user.id);
    return { success: true };
  }
}
