import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CookService } from './cook.service';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { gqlAccessGuard } from '../users/guards/gql-auth.guard';
import { Cook } from './entities/cook.entity';
import { IContext } from '../users/interfaces/user-service.interface';
import { CreateCookInput } from './dto/create-cook.input';
import { UpdateCookInput } from './dto/update-cook.input';
import { Recipe } from './entities/recipe.entity';
import { Ingredient } from './entities/ingredient.entity';
import { CreateIngredientInput } from './dto/create-ingredient.input';
import { UpdateIngredientInput } from './dto/update-ingredient.input';

@Resolver()
export class CookResolver {
  constructor(private readonly cookService: CookService) {}

  //요리 게시글 작성
  @UseGuards(gqlAccessGuard)
  @Mutation(() => Cook)
  async createCook(
    @Context() context: IContext,
    @Args('createCookInput')
    createCookInput: CreateCookInput,
  ) {
    return await this.cookService.create(context.req.user.id, createCookInput);
  }

  @Query(() => [Cook])
  async fetchCookByUserId(@Args('user_id') user_id: string): Promise<Cook> {
    return this.cookService.findByUserId(user_id);
  }

  //수정
  @Mutation(() => Cook)
  async updateCook(
    @Args('cook_id') cook_id: string,
    @Args('updateCookInput') updateCookInput: UpdateCookInput,
  ): Promise<Cook> {
    const result = await this.cookService.update(cook_id, updateCookInput);
    if (!result) {
      throw new BadRequestException(
        '알 수 없는 이유로 게시글 수정에 실패하였습니다.',
      );
    }
    return result;
  }

  //삭제
  @Mutation(() => Boolean)
  async deleteCook(@Args('cook_id') cook_id: string): Promise<boolean> {
    return await this.cookService.delete(cook_id);
  }

  //조회수 증가
  @Query(() => Cook)
  async increaseCookView(@Args('id') id: string): Promise<Cook> {
    return await this.cookService.increaseView(id);
  }

  //조회수로 순위 생성
  async fetchCookByViewRank(@Args('rank') rank: number): Promise<Cook[]> {
    return this.cookService.findTopCooks(rank);
  }

  //검색 기능
  @Query(() => [Cook])
  async searchCook(@Args('keyword') keyword: string): Promise<Cook[]> {
    return this.cookService.search(keyword);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Ingredient)
  async createIngredient(
    @Context() context: IContext,
    @Args('createIngredientInput')
    createIngredientInput: CreateIngredientInput,
  ) {
    return await this.cookService.createIngredient(context.req.user.id, {
      createIngredientInput,
    });
  }

  @Query(() => [Ingredient])
  async fetchIngredients(): Promise<Ingredient[]> {
    return await this.cookService.findIngredientAll();
  }

  @UseGuards(gqlAccessGuard)
  @Query(() => [Ingredient])
  async fetchMyIngredients(
    @Context() context: IContext,
  ): Promise<Ingredient[]> {
    return await this.cookService.findIngredientByUserId(context.req.user.id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Ingredient)
  async updateIngredient(
    @Args('updateIngredientInput') updateIngredientInput: UpdateIngredientInput,
  ): Promise<Ingredient> {
    const result = await this.cookService.updateIngredient({
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
    const ingre = await this.cookService.findIngredientById(ingredient_id);
    if (ingre.user.id !== context.req.user.id) {
      throw new BadRequestException(
        '로그인 된 사용자가 만든 식재료 정보가 아니어서 삭제에 실패하였습니다.',
      );
    }
    return await this.cookService.deleteIngredient(ingredient_id);
  }

  @UseGuards(gqlAccessGuard)
  @Query(() => [Recipe])
  async fetchRecipes(@Context() context: IContext) {
    return this.cookService.getRecipes(context.req.user.id);
  }
}
