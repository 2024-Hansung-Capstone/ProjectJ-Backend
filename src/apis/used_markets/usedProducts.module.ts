import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsedProduct } from './entities/used_product.entity';
import { Like_user_record } from './entities/like_user_record.entity';
import { UsedProductResolver } from './usedProducts.resolver';
import { UsedProductService } from './usedProducts.service';
import { UserService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Token } from '../users/entities/token.entity';
import { JwtModule } from '@nestjs/jwt';
import { AreaService } from '../area/area.service';
import { Sido } from '../area/entities/sido.entity';
import { Sgng } from '../area/entities/sgng.entity';
import { Dong } from '../area/entities/dong.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsedProduct,
      Like_user_record,
      User,
      Token,
      Sido,
      Sgng,
      Dong,
    ]),
    JwtModule.register({}),
  ],
  providers: [
    UsedProductResolver,
    UsedProductService,
    UserService,
    AreaService,
  ],
})
export class UsedProductModule {}
