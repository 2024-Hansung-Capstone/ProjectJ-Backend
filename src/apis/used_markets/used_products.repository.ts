import { EntityRepository, Repository } from 'typeorm';
import { Used_product } from './entities/used_product.entity';
@EntityRepository(Used_product)
export class UsedProductRepository extends Repository<Used_product> {}
