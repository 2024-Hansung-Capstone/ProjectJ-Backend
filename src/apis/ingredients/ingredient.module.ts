import { Module } from '@nestjs/common';
import { IngredientResolver } from './ingredient.resolver';
import { CommonModule } from '../common.module';

@Module({
  imports: [CommonModule],
  providers: [IngredientResolver],
})
export class IngredientModule {}
