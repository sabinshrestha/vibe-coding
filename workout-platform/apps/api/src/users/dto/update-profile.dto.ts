import { IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsEnum(['METRIC', 'IMPERIAL'])
  units?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  goals?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsEnum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ELITE'])
  experienceLevel?: string;
}
