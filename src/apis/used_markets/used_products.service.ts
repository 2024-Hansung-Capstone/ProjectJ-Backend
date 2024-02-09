import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, LessThanOrEqual } from 'typeorm';

import { Used_product } from './entities/used_product.entity';
import { UpdateUsed_ProductInput } from './dto/update-used_products.input';
import { User } from '../users/entities/user.entity';
import { Serach_ProductInput } from './dto/serach-used_products.input';
import { serialize } from 'v8';

@Injectable()
export class UsedProductService {
  constructor(
    @InjectRepository(Used_product)
    private readonly usedProductRepository: Repository<Used_product>,
  ) {}

  async findAll(): Promise<Used_product[]> {
    return this.usedProductRepository.find();
  }

  async findById(id: string): Promise<Used_product> {
    return this.usedProductRepository.findOne({ where: { id: id } });
  }

  async findByuser_Id(user_id: User): Promise<Used_product[]> {
    return this.usedProductRepository.find({ where: { user_id: user_id } });
  }

  async findBySerach(
    searchPostDto: Serach_ProductInput,
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

  async create(usedProduct: Used_product): Promise<Used_product> {
    return this.usedProductRepository.save(usedProduct);
  }

  async update(
    id: string,
    usedProduct: UpdateUsed_ProductInput,
  ): Promise<Used_product> {
    await this.usedProductRepository.update(id, usedProduct);
    return this.usedProductRepository.findOne({ where: { id: id } });
  }

  async delete(id: string): Promise<void> {
    await this.usedProductRepository.delete(id);
  }
}
