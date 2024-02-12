import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Used_product } from './entities/used_product.entity';
import { Like_user_record } from './entities/like_user_record.entity';
import { UsedProductResolver } from './used_products.resolver';
import { UsedProductService } from './used_products.service';
import { UsedProductRepository } from './used_products.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsedProductRepository,
      Used_product,
      Like_user_record,
    ]),
  ],
  providers: [UsedProductResolver, UsedProductService],
})
export class Used_productModule {}
