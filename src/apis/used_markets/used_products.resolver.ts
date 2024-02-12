import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsedProductService } from './used_products.service';
import { Used_product } from './entities/used_product.entity';
import { UpdateUsedProductInput } from './dto/update-used_products.input';
import { SearchProductInput } from './dto/search-used_products.input';
import { CreateProductInput } from './dto/create-used_products.input';
import { AddViewProductsInput } from './dto/addview_used_products.input';
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
    return this.usedProductService.findByuser_Id(user_id);
  }

  @Query(() => [Used_product])
  async getPosts(
    @Args('SerachUsed_ProductInput') searchUsed_ProductDto: SearchProductInput,
  ): Promise<Used_product[]> {
    return this.usedProductService.findBySerach(searchUsed_ProductDto);
  }

  @Mutation(() => Used_product)
  async createUsedProduct(
    @Args('CreateUsed_ProductInput') createUsed_ProductDto: CreateProductInput,
  ): Promise<Used_product> {
    return this.usedProductService.create(createUsed_ProductDto);
  }

  @Mutation(() => Used_product)
  async updateUsedProduct(
    @Args('id') id: string,
    @Args('UpdateUsed_ProductInput')
    updateUsed_ProductDto: UpdateUsedProductInput,
  ): Promise<Used_product> {
    return this.usedProductService.update(id, updateUsed_ProductDto);
  }

  @Mutation(() => Boolean)
  async deleteUsedProduct(@Args('id') id: string): Promise<boolean> {
    await this.usedProductService.delete(id);
    return true;
  }

  @Mutation(() => Used_product)
  addViewToPost(
    @Args('AddViewProductsInput') AddViewProductsInput: AddViewProductsInput,
  ): Promise<Used_product> {
    return this.usedProductService.addViewToPost(AddViewProductsInput);
  }
}
