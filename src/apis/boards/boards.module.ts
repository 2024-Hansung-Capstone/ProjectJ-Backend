import { Module } from '@nestjs/common';
import { BoardService } from './boards.service';
import { BoardResolver } from './boards.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Reply } from './entities/reply.entity';
import { User } from '../users/entities/user.entity';
import { Token } from '../users/entities/token.entity';
import { Sido } from '../area/entities/sido.entity';
import { Sgng } from '../area/entities/sgng.entity';
import { Dong } from '../area/entities/dong.entity';

import { Like_user_record } from '../used_markets/entities/like_user_record.entity';
import { UserService } from '../users/users.service';
import { AreaService } from '../area/area.service';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Board,
      Reply,
      Like_user_record,
      User,
      Token,
      Sido,
      Sgng,
      Dong,
    ]),
    JwtModule.register({}),
  ],
  providers: [BoardService, BoardResolver, UserService, AreaService],
})
export class BoardModule {}
