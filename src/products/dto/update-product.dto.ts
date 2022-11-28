//import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
/*
use partail type from swagger to create a documentation 
for update product dto and  use  partial type from nestjs/mapped-types
if you dont use documentation
*/
export class UpdateProductDto extends PartialType(CreateProductDto) {}
