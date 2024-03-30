import { Module } from '@nestjs/common';
import { OneRoomResolver } from './oneroom.resolver';
import { CommonModule } from '../common.module';
import { OneRoomScheduler } from './oneroom.scheduler';
@Module({
  imports: [CommonModule],
  providers: [OneRoomResolver, OneRoomScheduler],
})
export class OneRoomModule {}
