import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { FilterExercisesDto } from './dto/filter-exercises.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestUser } from '../common/types/request-user.type';

@ApiTags('exercises')
@ApiBearerAuth()
@Controller('exercises')
export class ExercisesController {
  constructor(private exercisesService: ExercisesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new exercise' })
  async create(@CurrentUser() user: RequestUser, @Body() createExerciseDto: CreateExerciseDto) {
    const data = await this.exercisesService.create(user.id, createExerciseDto);
    return { success: true, data };
  }

  @Get()
  @ApiOperation({ summary: 'Get all exercises with filters' })
  async findAll(@CurrentUser() user: RequestUser, @Query() filterDto: FilterExercisesDto) {
    const data = await this.exercisesService.findAll({ ...filterDto, userId: user.id });
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exercise by ID' })
  async findOne(@Param('id') id: string) {
    const data = await this.exercisesService.findOne(id);
    return { success: true, data };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update exercise' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
    @Body() updateExerciseDto: UpdateExerciseDto
  ) {
    const data = await this.exercisesService.update(id, user.id, updateExerciseDto);
    return { success: true, data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete exercise' })
  async remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    await this.exercisesService.remove(id, user.id);
    return { success: true };
  }
}
