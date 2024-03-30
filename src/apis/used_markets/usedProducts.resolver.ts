import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UsedProductService } from './usedProducts.service';
import { UsedProduct } from './entities/used_product.entity';
import { UpdateUsedProductInput } from './dto/update-usedProducts.input';
import { SearchProductInput } from './dto/search-usedProducts.input';
import { CreateUsedProductInput } from './dto/create-usedProducts.input';
import { gqlAccessGuard } from '../users/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { IContext } from '../users/interfaces/user-service.interface';
@Resolver(() => UsedProduct)
export class UsedProductResolver {
  constructor(private readonly usedProductService: UsedProductService) {}

  @Query(() => [UsedProduct], {
    description: '전체 중고 물품 정보를 확인합니다.',
  })
  async fetchUsedProducts(): Promise<UsedProduct[]> {
    return this.usedProductService.findAll();
  }

  @Query(() => UsedProduct, {
    description: '입력된 id값을 가진 중고 물품의 정보를 확인합니다.',
  })
  async fetchUsedProductById(@Args('id') id: string): Promise<UsedProduct> {
    return this.usedProductService.findById(id);
  }

  @Query(() => [UsedProduct], {
    description:
      '입력된 user_id를 가진 사용자가 작성한 중고 물품의 정보를 확인합니다.',
  })
  async fetchUsedProductByUserId(
    @Args('user_id') user_id: string,
  ): Promise<UsedProduct[]> {
    return await this.usedProductService.findByuser_Id(user_id);
  }

  @Query(() => [UsedProduct], {
    description:
      '종합검색 기능으로 가격은 검색한 가격보다 낮게 제목과 본문내용은 해당되는 내용이 있으면 검색이 되도록 설계',
  })
  async getPosts(
    @Args('SerachUsedProductInput') searchUsedProductInput: SearchProductInput,
  ): Promise<UsedProduct[]> {
    return this.usedProductService.findBySerach(searchUsedProductInput);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => UsedProduct, {
    description:
      'createUsedProductInput의 입력값을 바탕으로 새 중고 물품을 추가합니다. (user는 현재 로그인 된 사용자의 정보로 자동으로 등록되고, 로그인이 되어 있어야지만 추가 가능)',
  })
  async createUsedProduct(
    @Args('createUsedProductInput')
    createUsedProductInput: CreateUsedProductInput,
    @Context() context: IContext,
  ): Promise<UsedProduct> {
    return this.usedProductService.create(
      context.req.user.id,
      createUsedProductInput,
    );
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => UsedProduct, {
    description:
      'updateUsedProductInput의 입력값을 바탕으로 업데이트합니다. (게시글의 유저정보와 로그인 된 유저가 동일해야지만 업데이트 가능)',
  })
  async updateUsedProduct(
    @Args('updateUsedProductInput')
    updateUsedProductInput: UpdateUsedProductInput,
    @Context() context: IContext,
  ): Promise<UsedProduct> {
    return this.usedProductService.update(
      context.req.user.id,
      updateUsedProductInput,
    );
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Boolean, {
    description:
      '입력된 id값을 가진 중고물품을 삭제합니다. (게시글의 유저정보와 로그인 된 유저가 동일해야지만 삭제 가능)',
  })
  async deleteUsedProduct(
    @Args('product_id') product: string,
    @Context() context: IContext,
  ): Promise<boolean> {
    return await this.usedProductService.delete(context.req.user.id, product);
  }

  @Mutation(() => UsedProduct, {
    description: '게시글의 조회수를 1 증가시킵니다.',
  })
  addViewToPost(@Args('product_id') product_id: string): Promise<UsedProduct> {
    return this.usedProductService.addViewToPost(product_id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => UsedProduct, {
    description:
      '게시글의 찜 수(Like)를 올려주고 Like_user_record에 찜한 회원과 중고물품을 저장',
  })
  addLikeTopost(
    @Args('product_id') product_id: string,
    @Context() context: IContext,
  ): Promise<UsedProduct> {
    return this.usedProductService.addLikeToPost(
      context.req.user.id,
      product_id,
    );
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => UsedProduct, {
    description: '게시글의 찜을 취소하는 기능 찜한 게시글에게만 동작',
  })
  removeLikeTopost(
    @Args('product_id') product_id: string,
    @Context() context: IContext,
  ): Promise<UsedProduct> {
    return this.usedProductService.removeLikeToPost(
      context.req.user.id,
      product_id,
    );
  }
}
