import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class SessionSetDto {
  @ApiPropertyOptional()
  @IsOptional()
  actualReps?: number;

  @ApiPropertyOptional()
  @IsOptional()
  actualWeight?: number;

  @ApiPropertyOptional()
  @IsOptional()
  actualRpe?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

class SessionExerciseDto {
  @ApiProperty()
  @IsString()
  exerciseId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ type: [SessionSetDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SessionSetDto)
  sets?: SessionSetDto[];
}

export class StartSessionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiPropertyOptional({ type: [SessionExerciseDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SessionExerciseDto)
  exercises?: SessionExerciseDto[];
}
