import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Letter } from './entities/letter.entity';
import { LetterResolver } from './letters.resolver';
import { LetterService } from './letters.service';
import { UserService } from '../users/users.service';
import { UsedProductService } from '../used_markets/usedProducts.service';
import { BoardService } from '../boards/boards.service';
import { User } from '../users/entities/user.entity';
import { Token } from 'graphql';
import { AreaService } from '../area/area.service';
import { Sido } from '../area/entities/sido.entity';
import { Sgng } from '../area/entities/sgng.entity';
import { Dong } from '../area/entities/dong.entity';
import { UsedProduct } from '../used_markets/entities/used_product.entity';
import { Board } from '../boards/entities/board.entity';
import { Like_user_record } from '../used_markets/entities/like_user_record.entity';
import { Reply } from '../boards/entities/reply.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Letter,
      User,
      Token,
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
    LetterResolver,
    LetterService,
    UserService,
    AreaService,
    UsedProductService,
    BoardService,
  ],
})
export class LetterModule {}
