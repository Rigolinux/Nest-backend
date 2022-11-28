import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ProductsModule, TypeOrmModule, AuthModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
