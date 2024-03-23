import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsedProduct } from '../used_markets/entities/used_product.entity';
import { Dong } from '../area/entities/dong.entity';
import { Sgng } from '../area/entities/sgng.entity';
import { Sido } from '../area/entities/sido.entity';
import { Token } from 'graphql';
import { User } from '../users/entities/user.entity';
import { Letter } from '../letters/entities/letter.entity';
import { Board } from '../boards/entities/board.entity';
import { Like_user_record } from '../used_markets/entities/like_user_record.entity';
import { Reply } from '../boards/entities/reply.entity';
import { JwtModule } from '@nestjs/jwt';
import { LetterService } from '../letters/letters.service';
import { LetterResolver } from '../letters/letters.resolver';
import { UserService } from '../users/users.service';
import { AreaService } from '../area/area.service';
import { UsedProductService } from '../used_markets/usedProducts.service';
import { BoardService } from '../boards/boards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Letter,
      User,
      Token,s
      Sido,
      Sgng,
      Dong,
      UsedProduct,
      Board,
      Like_user_record,
      Reply,
    ]),
    JwtModule.register({}),
  ],
  providers: [
    LetterService,
    LetterResolver,
    UserService,
    AreaService,
    UsedProductService,
    BoardService,
  ],
})
export class notificationModule {}
