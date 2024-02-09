import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsedProductService } from './used_products.service';
import { Used_product } from './entities/used_product.entity';
import { UpdateUsed_ProductInput } from './dto/update-used_products.input';
import { User } from '../users/entities/user.entity';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Serach_ProductInput } from './dto/serach-used_products.input';
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
    @Args('user_id') user_id: User,
  ): Promise<Used_product[]> {
    return this.usedProductService.findByuser_Id(user_id);
  }

  @Query(() => [Used_product])
  @UsePipes(ValidationPipe)
  getPosts(
    @Args('Serach_ProductInput') searchPostDto: Serach_ProductInput,
  ): Promise<Used_product[]> {
    return this.usedProductService.findBySerach(searchPostDto);
  }

  @Mutation(() => Used_product)
  async createUsedProduct(
    @Args('usedProduct') usedProduct: Used_product,
  ): Promise<Used_product> {
    return this.usedProductService.create(usedProduct);
  }

  @Mutation(() => Used_product)
  async updateUsedProduct(
    @Args('id') id: string,
    @Args('UpdateUsed_ProductInput') usedProduct: UpdateUsed_ProductInput,
  ): Promise<Used_product> {
    return this.usedProductService.update(id, usedProduct);
  }

  @Mutation(() => Boolean)
  async deleteUsedProduct(@Args('id') id: string): Promise<boolean> {
    await this.usedProductService.delete(id);
    return true;
  }
}
