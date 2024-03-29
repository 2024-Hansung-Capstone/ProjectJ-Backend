import { Module } from '@nestjs/common';
import { OneRoomResolver } from './oneroom.resolver';
import { CommonModule } from '../common.module';
@Module({
  imports: [CommonModule],
  providers: [OneRoomResolver],
})
export class OneRoomModule {}
