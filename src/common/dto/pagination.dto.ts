/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/';

export class PaginationDto {
  @ApiProperty({
    default: 10,
    description: 'Number of items to return',
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  //transform string to number
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'Number of items to skip',
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  offset?: number;
}
