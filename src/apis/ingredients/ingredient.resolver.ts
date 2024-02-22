import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IngredientService } from './ingredient.service';
import { Ingredient } from './entities/ingredient.entity';
import { UseGuards } from '@nestjs/common';
import { gqlAccessGuard } from '../users/guards/gql-auth.guard';
import { IContext } from '../users/interfaces/user-service.interface';
import { CreateIngredientInput } from './dto/create-ingredient.input';
import { UpdateIngredientInput } from './dto/update-ingredient.input';

@Resolver()
export class IngredientResolver {
  constructor(private readonly ingredientService: IngredientService) {}

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Ingredient)
  async createIngredient(
    @Context() context: IContext,
    @Args('createIngredientInput')
    createIngredientInput: CreateIngredientInput,
  ) {
    return await this.ingredientService.create(context.req.user.id, {
      createIngredientInput,
    });
  }

  @Query(() => [Ingredient])
  async fetchIngredients(): Promise<Ingredient[]> {
    return await this.ingredientService.findAll();
  }

  @UseGuards(gqlAccessGuard)
  @Query(() => [Ingredient])
  async fetchMyIngredients(
    @Context() context: IContext,
  ): Promise<Ingredient[]> {
    return await this.ingredientService.findByUserId(context.req.user.id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Ingredient)
  async updateIngredient(
    @Args('updateIngredientInput') updateIngredientInput: UpdateIngredientInput,
  ): Promise<Ingredient> {
    return await this.ingredientService.update({ updateIngredientInput });
  }
}
