import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Letter } from './entities/letter.entity';
import { LetterResolver } from './letters.resolver';
import { LetterService } from './letters.service';

@Module({
  imports: [TypeOrmModule.forFeature([Letter])],
  providers: [LetterResolver, LetterService],
})
export class LetterModule {}
