import { Module } from '@nestjs/common';
import { CommonModule } from '../common.module';
import { CookResolver } from './cook.resolver';

@Module({
  imports: [CommonModule],
  providers: [CookResolver],
})
export class CookModule {}
