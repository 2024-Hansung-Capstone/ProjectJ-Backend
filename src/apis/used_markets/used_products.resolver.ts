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

  @Query(() => [Used_product], {
    description:
      '모든 중고물품을 가져 올 수 있는 api 중고물품과 관련이 있는 User까지 함께 가져옴',
  })
  async usedProducts(): Promise<Used_product[]> {
    return this.usedProductService.findAll();
  }

  @Query(() => Used_product, {
    description:
      'id에 해당되는 중고물품을 가져 올 수 있는 api 중고물품과 관련이 있는 User까지 함께 가져옴',
  })
  async usedProductById(@Args('id') id: string): Promise<Used_product> {
    return this.usedProductService.findById(id);
  }

  @Query(() => [Used_product], {
    description:
      'user_id에 해당되는 중고물품을 가져 올 수 있는 api 중고물품과 관련이 있는 User까지 함께 가져옴',
  })
  async usedProductByuser_Id(
    @Args('user_id') user_id: string,
  ): Promise<Used_product[]> {
    return await this.usedProductService.findByuser_Id(user_id);
  }

  @Query(() => [Used_product], {
    description:
      '종합검색 기능으로 가격은 검색한 가격보다 낮게 제목과 본문내용은 해당되는 내용이 있으면 검색이 되도록 설계',
  })
  async getPosts(
    @Args('SerachUsed_ProductInput') searchUsed_ProductDto: SearchProductInput,
  ): Promise<Used_product[]> {
    return this.usedProductService.findBySerach(searchUsed_ProductDto);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Used_product, {
    description:
      '로그인된 유저의 정보와 CreateProductInput을 바탕으로 게시글 Create',
  })
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
  @Mutation(() => Used_product, {
    description:
      'updateUsed_ProductDto를 바탕으로 업데이트 만일 게시글의 유저정보와 업데이트하는 유저가 다를 시 동작하지 않음',
  })
  async updateUsedProduct(
    @Args('id') id: string,
    @Args('UpdateUsed_ProductInput')
    updateUsed_ProductDto: UpdateUsedProductInput,
    @Context() context: IContext,
  ): Promise<Used_product> {
    const user_id = context.req.user.id;
    return this.usedProductService.update(id, updateUsed_ProductDto, user_id);
  }

  //물건 판매 상태만 바꾸는 코드
  @UseGuards(gqlAccessGuard)
  @Mutation(() => Used_product, {
    description:
      '게시글가격만 업데이트 만일 게시글의 유저정보와 판매 상태 업데이트하는 유저가 다를 시 동작하지 않음',
  })
  updateDealState(
    @Args('UpdateUsed_ProductStateInput')
    UpdateUsed_ProductStateInput: UpdateUsedProductStateInput,
    @Context() context: IContext,
  ): Promise<Used_product> {
    const user_id = context.req.user.id;
    return this.usedProductService.updateDealState(
      UpdateUsed_ProductStateInput,
      user_id,
    );
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Boolean, {
    description:
      '게시글 삭제 만일 게시글의 유저정보와 판매 상태 삭제하는 유저가 다를 시 동작하지 않음',
  })
  async deleteUsedProduct(
    @Args('id') id: string,
    @Context() context: IContext,
  ): Promise<boolean> {
    const user_id = context.req.user.id;
    return await this.usedProductService.delete(user_id, id);
  }

  @Mutation(() => Used_product, {
    description: '게시글의 조회수를 늘려주는 API',
  })
  addViewToPost(
    @Args('AddViewProductsInput') AddViewProductsInput: AddViewProductInput,
  ): Promise<Used_product> {
    return this.usedProductService.addViewToPost(AddViewProductsInput);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Used_product, {
    description:
      '게시글의 찜 수(Like)를 올려주고 Like_user_record에 찜한 회원과 중고물품을 저장',
  })
  addLikeTopost(
    @Args('AddLikeProductsInput') AddLikeProductInput: AddLikeProductInput,
    @Context() context: IContext,
  ): Promise<Used_product> {
    const user_id = context.req.user.id;
    return this.usedProductService.addLikeToPost(AddLikeProductInput, user_id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Used_product, {
    description: '게시글의 찜을 취소하는 기능 찜한 게시글에게만 동작',
  })
  removeLikeTopost(
    @Args('id') id: string,
    @Context() context: IContext,
  ): Promise<Used_product> {
    const user_id = context.req.user.id;
    return this.usedProductService.removeLikeToPost(id, user_id);
  }
}
