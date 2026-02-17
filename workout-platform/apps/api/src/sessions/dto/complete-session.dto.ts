import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CompleteSessionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
