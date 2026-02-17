import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class TemplateSetDto {
  @ApiPropertyOptional()
  @IsOptional()
  targetReps?: number;

  @ApiPropertyOptional()
  @IsOptional()
  targetWeight?: number;

  @ApiPropertyOptional()
  @IsOptional()
  targetRpe?: number;

  @ApiPropertyOptional()
  @IsOptional()
  restTime?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tempo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  groupId?: string;
}

class TemplateExerciseDto {
  @ApiProperty()
  @IsString()
  exerciseId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [TemplateSetDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateSetDto)
  sets: TemplateSetDto[];
}

export class CreateTemplateDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [TemplateExerciseDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateExerciseDto)
  exercises: TemplateExerciseDto[];
}
