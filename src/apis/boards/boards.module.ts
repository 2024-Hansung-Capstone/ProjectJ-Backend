import { Module } from '@nestjs/common';
import { BoardResolver } from './boards.resolver';
import { CommonModule } from '../common.module';
@Module({
  imports: [CommonModule],
  providers: [BoardResolver],
})
export class BoardModule {}
