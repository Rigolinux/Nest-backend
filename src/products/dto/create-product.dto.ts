import {
  IsString,
  MinLength,
  IsNumber,
  IsPositive,
  IsOptional,
  IsInt,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateProductDto {
  @ApiProperty({
    example: 'Product 1',
    description: 'Product title',
    minimum: 3,
  })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    example: 10,
    description: 'Product price',
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsInt()
  @IsPositive()
  stock?: number;

  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @IsString({ each: true })
  gender: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
