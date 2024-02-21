import { Module } from '@nestjs/common';
import { BoardService } from './boards.service';
import { BoardResolver } from './boards.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Reply } from './entities/reply.entity';
import { Like_user_record } from '../used_markets/entities/like_user_record.entity';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forFeature([Board, Reply, Like_user_record]),
    JwtModule.register({}),
  ],
  providers: [BoardService, BoardResolver],
})
export class BoardModule {}
