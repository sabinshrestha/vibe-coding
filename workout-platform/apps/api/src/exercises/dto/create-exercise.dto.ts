import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExerciseDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiProperty()
  @IsArray()
  muscleGroups: string[];

  @ApiProperty()
  @IsArray()
  equipment: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isGlobal?: boolean;
}
