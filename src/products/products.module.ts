import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AuthModule } from '../auth/auth.module';
//db typeorm
import { TypeOrmModule } from '@nestjs/typeorm';

//entity
import { Product, ProductImage } from './entities/';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [TypeOrmModule.forFeature([Product, ProductImage]), AuthModule],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
