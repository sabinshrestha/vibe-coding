import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestUser } from '../common/types/request-user.type';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@CurrentUser() user: RequestUser) {
    const data = await this.usersService.getProfile(user.id);
    return { success: true, data };
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(@CurrentUser() user: RequestUser, @Body() updateProfileDto: UpdateProfileDto) {
    const data = await this.usersService.updateProfile(user.id, updateProfileDto);
    return { success: true, data };
  }
}
