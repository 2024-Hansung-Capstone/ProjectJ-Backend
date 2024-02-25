import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IngredientService } from './ingredient.service';
import { Ingredient } from './entities/ingredient.entity';
import { BadRequestException, UseGuards } from '@nestjs/common';
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
    const result = await this.ingredientService.update({
      updateIngredientInput,
    });
    if (!result) {
      throw new BadRequestException(
        '알 수 없는 이유로 식재료 정보 수정에 실패하였습니다.',
      );
    }
    return result;
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Boolean)
  async deleteIngredient(
    @Context() context: IContext,
    @Args('ingredient_id') ingredient_id: string,
  ) {
    const ingre = await this.ingredientService.findById(ingredient_id);
    if (ingre.user.id !== context.req.user.id) {
      throw new BadRequestException(
        '로그인 된 사용자가 만든 식재료 정보가 아니어서 삭제에 실패하였습니다.',
      );
    }
    return await this.ingredientService.delete(ingredient_id);
  }
}
