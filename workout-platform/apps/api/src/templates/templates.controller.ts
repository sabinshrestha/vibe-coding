import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestUser } from '../common/types/request-user.type';

@ApiTags('templates')
@ApiBearerAuth()
@Controller('templates')
export class TemplatesController {
  constructor(private templatesService: TemplatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create workout template' })
  async create(@CurrentUser() user: RequestUser, @Body() createTemplateDto: CreateTemplateDto) {
    const data = await this.templatesService.create(user.id, createTemplateDto);
    return { success: true, data };
  }

  @Get()
  @ApiOperation({ summary: 'Get all templates' })
  async findAll(@CurrentUser() user: RequestUser) {
    const data = await this.templatesService.findAll(user.id);
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template by ID' })
  async findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    const data = await this.templatesService.findOne(id, user.id);
    return { success: true, data };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update template' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
    @Body() updateTemplateDto: UpdateTemplateDto
  ) {
    const data = await this.templatesService.update(id, user.id, updateTemplateDto);
    return { success: true, data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Archive template' })
  async remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    await this.templatesService.remove(id, user.id);
    return { success: true };
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate template' })
  async duplicate(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    const data = await this.templatesService.duplicate(id, user.id);
    return { success: true, data };
  }
}
