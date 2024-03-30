import { Module } from '@nestjs/common';
import { CommonModule } from '../common.module';

@Module({
  imports: [CommonModule],
  providers: [],
})
export class LikeUserRecordModule {}
