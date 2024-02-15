import { EntityRepository, Repository } from 'typeorm';
import { Used_product } from './entities/used_product.entity';
import { CreateProductInput } from './dto/create-used_products.input';
import { User } from '../users/entities/user.entity';
@EntityRepository(Used_product)
export class UsedProductRepository extends Repository<Used_product> {}
