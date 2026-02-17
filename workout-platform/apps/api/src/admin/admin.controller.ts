import { Controller, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { AdminService } from './admin.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleType } from '@workout/shared';

@ApiTags('admin')
@ApiBearerAuth()
@Roles(RoleType.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers() {
    const data = await this.adminService.getAllUsers();
    return { success: true, data };
  }

  @Put('users/:id/roles')
  @ApiOperation({ summary: 'Change user roles' })
  async changeUserRole(@Param('id') id: string, @Body() body: { roles: string[] }) {
    const data = await this.adminService.changeUserRole(id, body.roles);
    return { success: true, data };
  }

  @Get('exercises/pending')
  @ApiOperation({ summary: 'Get pending exercise approvals' })
  async getPendingExercises() {
    const data = await this.adminService.getPendingExercises();
    return { success: true, data };
  }

  @Put('exercises/:id/approve')
  @ApiOperation({ summary: 'Approve exercise' })
  async approveExercise(@Param('id') id: string) {
    await this.adminService.approveExercise(id);
    return { success: true };
  }

  @Delete('exercises/:id/reject')
  @ApiOperation({ summary: 'Reject exercise' })
  async rejectExercise(@Param('id') id: string) {
    await this.adminService.rejectExercise(id);
    return { success: true };
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get audit logs' })
  async getAuditLogs(@Query('limit') limit?: string) {
    const data = await this.adminService.getAuditLogs(limit ? parseInt(limit) : 100);
    return { success: true, data };
  }
}
