import { Module } from '@nestjs/common';
import { UsedProductResolver } from './usedProducts.resolver';
import { CommonModule } from '../common.module';

@Module({
  imports: [CommonModule],
  providers: [UsedProductResolver],
})
export class UsedProductModule {}
