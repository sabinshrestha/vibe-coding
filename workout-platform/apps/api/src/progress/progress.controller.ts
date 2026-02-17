import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { ProgressService } from './progress.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestUser } from '../common/types/request-user.type';

@ApiTags('progress')
@ApiBearerAuth()
@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getDashboardStats(@CurrentUser() user: RequestUser) {
    const data = await this.progressService.getDashboardStats(user.id);
    return { success: true, data };
  }

  @Get('volume')
  @ApiOperation({ summary: 'Get volume data over time' })
  async getVolumeData(@CurrentUser() user: RequestUser, @Query('days') days?: string) {
    const data = await this.progressService.getVolumeData(user.id, days ? parseInt(days) : 30);
    return { success: true, data };
  }

  @Get('1rm')
  @ApiOperation({ summary: 'Get 1RM progression data' })
  async getOneRMData(@CurrentUser() user: RequestUser, @Query('exerciseId') exerciseId?: string) {
    const data = await this.progressService.getOneRMData(user.id, exerciseId);
    return { success: true, data };
  }

  @Get('prs')
  @ApiOperation({ summary: 'Get personal records' })
  async getPersonalRecords(@CurrentUser() user: RequestUser) {
    const data = await this.progressService.getPersonalRecords(user.id);
    return { success: true, data };
  }

  @Get('body-metrics')
  @ApiOperation({ summary: 'Get body metrics history' })
  async getBodyMetrics(@CurrentUser() user: RequestUser) {
    const data = await this.progressService.getBodyMetrics(user.id);
    return { success: true, data };
  }

  @Post('body-metrics')
  @ApiOperation({ summary: 'Create body metric entry' })
  async createBodyMetric(@CurrentUser() user: RequestUser, @Body() data: any) {
    const result = await this.progressService.createBodyMetric(user.id, data);
    return { success: true, data: result };
  }
}
