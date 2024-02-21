import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsedProduct } from './entities/used_product.entity';
import { Like_user_record } from './entities/like_user_record.entity';
import { UsedProductResolver } from './usedProducts.resolver';
import { UsedProductService } from './usedProducts.service';
import { gqlAccessGuard } from '../users/guards/gql-auth.guard';
import { UserService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Token } from '../users/entities/token.entity';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forFeature([UsedProduct, Like_user_record, User, Token]),
    JwtModule.register({}),
  ],
  providers: [
    UsedProductResolver,
    UsedProductService,
    gqlAccessGuard,
    UserService,
  ],
})
export class UsedProductModule {}
