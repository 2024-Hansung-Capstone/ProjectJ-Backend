import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, LessThanOrEqual } from 'typeorm';
import { Used_product } from './entities/used_product.entity';
import { UpdateUsed_ProductInput } from './dto/update-used_products.input';
import { User } from '../users/entities/user.entity';
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

  async findByCategory(category: string): Promise<Used_product[]> {
    return this.usedProductRepository.find({ where: { category: category } });
  }

  async findByDetail(detail: string): Promise<Used_product[]> {
    return this.usedProductRepository.find({
      where: {
        detail: Like('%${detail}%'),
      },
    });
  }

  async findByTitle(title: string): Promise<Used_product[]> {
    return this.usedProductRepository.find({
      where: {
        title: Like('%${title}%'),
      },
    });
  }

  async findBelowPrice(price: number): Promise<Used_product[]> {
    return this.usedProductRepository.find({
      where: { price: LessThanOrEqual(price) },
    });
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
