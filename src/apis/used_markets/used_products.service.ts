import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, LessThanOrEqual, Repository, getRepository } from 'typeorm';
import { CreateProductInput } from './dto/create-used_products.input';
import { Used_product } from './entities/used_product.entity';
import { UpdateUsedProductInput } from './dto/update-used_products.input';
import { SearchProductInput } from './dto/search-used_products.input';
import { User } from '../users/entities/user.entity';
import { AddViewProductsInput } from './dto/addview_used_products.input';
@Injectable()
export class UsedProductService {
  constructor(
    @InjectRepository(Used_product)
    private usedProductRepository: Repository<Used_product>,
  ) {}

  async findAll(): Promise<Used_product[]> {
    return this.usedProductRepository.find();
  }

  async findById(id: string): Promise<Used_product> {
    return this.usedProductRepository.findOne({ where: { id: id } });
  }

  async findByuser_Id(user_id: string): Promise<Used_product[]> {
    const userRepository = getRepository(User);

    // 사용자 조회
    const user = await userRepository.findOne({ where: { id: user_id } });
    return this.usedProductRepository.find({ where: { user_id: user } });
  }

  async findBySerach(
    searchPostDto: SearchProductInput,
  ): Promise<Used_product[]> {
    const { title, price, detail, category, state } = searchPostDto;
    const searchConditions: any = {};
    if (category) {
      searchConditions.category = category;
    }
    if (price) {
      searchConditions.price = LessThanOrEqual(price);
    }
    if (title) {
      searchConditions.title = Like(`%${title}%`);
    }

    if (detail) {
      searchConditions.detail = Like(`%${detail}%`);
    }
    if (state) {
      searchConditions.state = state;
    }
    return this.usedProductRepository.find({ where: searchConditions });
  }

  async create(usedProduct: CreateProductInput): Promise<Used_product> {
    const { title, price, detail, category, state, user_id } = usedProduct;
    const userRepository = getRepository(User);

    // 사용자 조회
    const user = await userRepository.findOne({ where: { id: user_id } });

    const Used_Product = new Used_product();
    Used_Product.title = title;
    Used_Product.price = price;
    Used_Product.detail = detail;
    Used_Product.category = category;
    Used_Product.state = state;
    Used_Product.user_id = user;
    Used_Product.create_at = new Date(); // DTO에서 받은 create_at 할당
    return await this.usedProductRepository.save(Used_Product);
  }

  async update(
    id: string,
    usedProduct: UpdateUsedProductInput,
  ): Promise<Used_product> {
    await this.usedProductRepository.update(id, usedProduct);
    return this.usedProductRepository.findOne({ where: { id: id } });
  }

  async delete(id: string): Promise<void> {
    await this.usedProductRepository.delete(id);
  }

  async addViewToPost(
    AddViewProductsInput: AddViewProductsInput,
  ): Promise<Used_product> {
    const Used_Product_id = AddViewProductsInput.id;
    const Used_Product = await this.usedProductRepository.findOne({
      where: { id: Used_Product_id },
    });
    if (!Used_Product) {
      throw new Error('Post not found');
    }
    Used_Product.view = Used_Product.view + 1;

    return this.usedProductRepository.save(Used_Product);
  }
}
