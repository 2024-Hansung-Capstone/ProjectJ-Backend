import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsedProductService } from './used_products.service';
import { Used_product } from './entities/used_product.entity';
import { UpdateUsed_ProductInput } from './dto/update-used_products.input';
import { User } from '../users/entities/user.entity';
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
  async usedProductByCategory(
    @Args('category') catrgory: string,
  ): Promise<Used_product[]> {
    return this.usedProductService.findByCategory(catrgory);
  }

  @Query(() => [Used_product])
  async usedProductByDetail(@Args('detail') detail: string) {
    return this.usedProductService.findByDetail(detail);
  }

  @Query(() => [Used_product])
  async usedProductByTitle(@Args('title') title: string) {
    return this.usedProductService.findByTitle(title);
  }

  @Query(() => [Used_product])
  async usedProductsBelowPrice(
    @Args('price') price: number,
  ): Promise<Used_product[]> {
    return this.usedProductService.findBelowPrice(price);
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
