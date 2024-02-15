import { Module } from '@nestjs/common';
import { BoardService } from './boards.service';
import { BoardResolver } from './boards.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board])],
  providers: [BoardService, BoardResolver],
})
export class BoardModule {}
