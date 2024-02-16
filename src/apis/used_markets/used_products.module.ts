import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Used_product } from './entities/used_product.entity';
import { Like_user_record } from './entities/like_user_record.entity';
import { UsedProductResolver } from './used_products.resolver';
import { UsedProductService } from './used_products.service';
import { UsedProductRepository } from './used_products.repository';
import { gqlAccessGuard } from '../users/guards/gql-auth.guard';
import { UserService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Token } from '../users/entities/token.entity';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsedProductRepository,
      Used_product,
      Like_user_record,
      User,
      Token,
    ]),
    JwtModule.register({}),
  ],
  providers: [
    UsedProductResolver,
    UsedProductService,
    gqlAccessGuard,
    UserService,
  ],
})
export class Used_productModule {}
