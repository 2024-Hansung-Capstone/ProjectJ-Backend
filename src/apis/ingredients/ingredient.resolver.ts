import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { IngredientService } from './ingredient.service';
import { Ingredient } from './entities/ingredient.entity';
import { UseGuards } from '@nestjs/common';
import { gqlAccessGuard } from '../users/guards/gql-auth.guard';
import { IContext } from '../users/interfaces/user-service.interface';
import { CreateIngredientInput } from './dto/create-ingredient.input';

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
}
