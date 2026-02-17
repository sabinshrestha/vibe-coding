import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class LogSetDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  actualReps?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  actualWeight?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  actualRpe?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
