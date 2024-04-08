import { Module } from '@nestjs/common';

import { CommonModule } from '../common.module';
import { PointResolver } from './point.resolver';
@Module({
  imports: [CommonModule],
  providers: [PointResolver],
})
export class PointModule {}
