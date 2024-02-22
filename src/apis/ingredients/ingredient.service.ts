import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { IIngredientServiceCreate } from './interfaces/ingredient-service.interface';
import { UserService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
    private readonly userService: UserService,
  ) {}

  async create(
    user_id: string,
    createIngredientInput: IIngredientServiceCreate,
  ) {
    const user = await this.userService.findById(user_id);
    const newIngredient = await this.ingredientRepository.save({
      user: user,
      createIngredientInput,
    });
    return await this.findById(newIngredient.id);
  }

  async findById(ingredient_id: string): Promise<Ingredient> {
    return await this.ingredientRepository.findOne({
      where: { id: ingredient_id },
      relations: ['user', 'user.dong', 'user.dong.sgng', 'user.dong.sgng.sido'],
    });
  }

  update() {}

  delete() {}
}
