import { Module } from '@nestjs/common';
import { IngredientResolver } from './ingredient.resolver';
import { IngredientService } from './ingredient.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient])],
  providers: [IngredientResolver, IngredientService],
})
export class IngredientModule {}
