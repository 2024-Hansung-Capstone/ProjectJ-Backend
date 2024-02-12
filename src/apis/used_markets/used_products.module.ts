import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Used_product } from './entities/used_product.entity';
import { Like_user } from './entities/like_user.entity';
import { UsedProductResolver } from './used_products.resolver';
import { UsedProductService } from './used_products.service';
@Module({
  imports: [TypeOrmModule.forFeature([Used_product, Like_user])],
  providers: [UsedProductResolver, UsedProductService],
})
export class Used_productModule {}
