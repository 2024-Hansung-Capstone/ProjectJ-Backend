import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UsedProductService } from './used_products.service';
import { Used_product } from './entities/used_product.entity';
import { UpdateUsedProductInput } from './dto/update-used_products.input';
import { SearchProductInput } from './dto/search-used_products.input';
import { CreateProductInput } from './dto/create-used_products.input';
import { AddViewProductInput } from './dto/addview_used_products.input';
import { AddLikeProductInput } from './dto/addlike_used_products.inpput';
import { UpdateUsedProductStateInput } from './dto/update-used_products.state.input';
import { gqlAccessGuard } from '../users/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { IContext } from '../users/interfaces/user-service.interface';
@Resolver(() => Used_product)
export class UsedProductResolver {
  constructor(private readonly usedProductService: UsedProductService) {}

  @Query(() => [Used_product])
  async usedProducts(): Promise<Used_product[]> {
    return this.usedProductService.findAll();
  }

  @Query(() => Used_product)
  async usedProductById(@Args('id') id: string): Promise<Used_product> {
    return this.usedProductService.findById(id);
  }

  @Query(() => [Used_product])
  async usedProductByuser_Id(
    @Args('user_id') user_id: string,
  ): Promise<Used_product[]> {
    return await this.usedProductService.findByuser_Id(user_id);
  }

  @Query(() => [Used_product])
  async getPosts(
    @Args('SerachUsed_ProductInput') searchUsed_ProductDto: SearchProductInput,
  ): Promise<Used_product[]> {
    return this.usedProductService.findBySerach(searchUsed_ProductDto);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Used_product)
  async createUsedProduct(
    @Args('CreateUsed_ProductInput') createUsed_ProductDto: CreateProductInput,
    @Context() context: IContext,
  ): Promise<Used_product> {
    return this.usedProductService.create(
      context.req.user.id,
      createUsed_ProductDto,
    );
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Used_product)
  async updateUsedProduct(
    @Args('id') id: string,
    @Args('UpdateUsed_ProductInput')
    updateUsed_ProductDto: UpdateUsedProductInput,
    @Context() context: IContext,
  ): Promise<Used_product> {
    return this.usedProductService.update(id, updateUsed_ProductDto, context);
  }

  //물건 판매 상태만 바꾸는 코드
  @UseGuards(gqlAccessGuard)
  @Mutation(() => Used_product)
  updateDealState(
    @Args('UpdateUsed_ProductStateInput')
    UpdateUsed_ProductStateInput: UpdateUsedProductStateInput,
    @Context() context: IContext,
  ): Promise<Used_product> {
    return this.usedProductService.updateDealState(
      UpdateUsed_ProductStateInput,
      context,
    );
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Boolean)
  async deleteUsedProduct(
    @Args('id') id: string,
    @Context() context: IContext,
  ): Promise<boolean> {
    await this.usedProductService.delete(context, id);
    return true;
  }

  @Mutation(() => Used_product)
  addViewToPost(
    @Args('AddViewProductsInput') AddViewProductsInput: AddViewProductInput,
  ): Promise<Used_product> {
    return this.usedProductService.addViewToPost(AddViewProductsInput);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Used_product)
  addLikeTopost(
    @Args('AddLikeProductsInput') AddLikeProductInput: AddLikeProductInput,
    @Context() context: IContext,
  ): Promise<Used_product> {
    return this.usedProductService.addLikeToPost(AddLikeProductInput, context);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Used_product)
  removeLikeTopost(
    @Args('id') id: string,
    @Context() context: IContext,
  ): Promise<Used_product> {
    return this.usedProductService.removeLikeToPost(id, context);
  }
}
