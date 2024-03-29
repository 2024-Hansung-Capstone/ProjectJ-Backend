import { Module } from '@nestjs/common';
import { AreaResolver } from './area.resolver';
import { CommonModule } from '../common.module';

@Module({
  imports: [CommonModule],
  providers: [AreaResolver],
})
export class AreaModule {}
