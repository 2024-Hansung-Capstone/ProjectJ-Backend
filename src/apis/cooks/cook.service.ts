import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Cook } from './entities/cook.entity';
import { UserService } from '../users/users.service';
import { CreateCookInput } from './dto/create-cook.input';
import { UpdateCookInput } from './dto/update-cook.input';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { Ingredient } from './entities/ingredient.entity';
import {
  IIngredientServiceCreate,
  IIngredientServiceUpdate,
} from './interfaces/ingredient-service.interface';
import { Recipe } from './entities/recipe.entity';

@Injectable()
export class CookService {
  constructor(
    @InjectRepository(Cook)
    private readonly cookRepository: Repository<Cook>,
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
    private readonly userService: UserService,
    private httpService: HttpService,
  ) {}

  async create(
    user_id: string,
    createCookInput: CreateCookInput,
  ): Promise<Cook> {
    const user = await this.userService.findById(user_id);
    const newCook = this.cookRepository.create({
      user: user,
      ...createCookInput,
    });
    return await this.cookRepository.save(newCook);
  }

  async update(
    cook_id: string,
    updateCookInput: UpdateCookInput,
  ): Promise<Cook> {
    const cook = await this.findById(cook_id);
    if (!cook) {
      throw new BadRequestException('수정해야 할 게시글을 찾을 수 없습니다.');
    }
    const result = await this.cookRepository.update(
      { id: cook_id },
      { ...updateCookInput },
    );

    if (result.affected > 0) {
      return await this.findById(cook_id);
    } else {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.cookRepository.delete(id);
    return result.affected > 0;
  }

  async findById(cook_id: string): Promise<Cook> {
    return await this.cookRepository.findOne({
      where: { id: cook_id },
      relations: ['user', 'user.dong', 'user.dong.sgng', 'user.dong.sgng.sido'],
    });
  }

  async findByUserId(user_id: string): Promise<Cook[]> {
    return await this.cookRepository.find({
      where: { user: { id: user_id } },
      relations: ['user', 'user.dong', 'user.dong.sgng', 'user.dong.sgng.sido'],
    });
  }

  async increaseView(cook_id: string): Promise<Cook> {
    const cook = await this.cookRepository.findOneBy({ id: cook_id });
    if (!cook) {
      throw new BadRequestException('게시글을 찾을 수 없습니다.');
    }
    cook.view += 1;
    return await this.cookRepository.save(cook);
  }

  async findTopCooks(rank: number): Promise<Cook[]> {
    return await this.cookRepository.find({
      order: { view: 'DESC' },
      take: rank,
    });
  }

  async search(keyword: string): Promise<Cook[]> {
    if (keyword.length < 2) {
      throw new BadRequestException('검색어가 두 글자 이상이어야 합니다.');
    }
    return await this.cookRepository.find({
      where: { name: Like(`%${keyword}%`) },
    });
  }

  async createIngredient(
    user_id: string,
    { createIngredientInput }: IIngredientServiceCreate,
  ): Promise<Ingredient> {
    const user = await this.userService.findById(user_id);
    const newIngredient = await this.ingredientRepository.save({
      user: user,
      ...createIngredientInput,
    });
    return await this.findIngredientById(newIngredient.id);
  }

  async findIngredientById(ingredient_id: string): Promise<Ingredient> {
    return await this.ingredientRepository.findOne({
      where: { id: ingredient_id },
      relations: ['user', 'user.dong', 'user.dong.sgng', 'user.dong.sgng.sido'],
    });
  }

  async findIngredientAll(): Promise<Ingredient[]> {
    return await this.ingredientRepository.find({
      relations: ['user', 'user.dong', 'user.dong.sgng', 'user.dong.sgng.sido'],
    });
  }

  async findIngredientByUserId(user_id: string): Promise<Ingredient[]> {
    return await this.ingredientRepository.find({
      where: { user: { id: user_id } },
      relations: ['user', 'user.dong', 'user.dong.sgng', 'user.dong.sgng.sido'],
    });
  }

  async updateIngredient({
    updateIngredientInput,
  }: IIngredientServiceUpdate): Promise<Ingredient> {
    const { id, ...rest } = updateIngredientInput;
    const result = await this.ingredientRepository.update(
      { id: id },
      { ...rest },
    );
    if (result.affected > 0) {
      return await this.findIngredientById(id);
    } else {
      return null;
    }
  }

  async deleteIngredient(ingredient_id: string): Promise<boolean> {
    const result = await this.ingredientRepository.delete({
      id: ingredient_id,
    });
    return result.affected > 0;
  }

  async getRecipes(user_id: string) {
    const myIngredients = await this.findIngredientByUserId(user_id);
    const ingredientsInfo = myIngredients.map((ingredient) => ({
      name: ingredient.name,
      count: ingredient.count,
      volume: ingredient.volume,
      volume_unit: ingredient.volume_unit,
    }));

    const headers = {
      Authorization: `Bearer ${process.env.OPENAI_SECRET}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2',
    };

    const run = await this.httpService
      .post(
        `https://api.openai.com/v1/threads/runs`,
        {
          assistant_id: 'asst_YFQJAwlpvKdljoQuYnZZHBDt',
          thread: {
            messages: [
              {
                role: 'user',
                content: JSON.stringify(ingredientsInfo),
              },
            ],
          },
        },
        { headers: headers },
      )
      .pipe(map((response) => response.data))
      .toPromise();

    console.log(`run ID : ${run.id}`);

    let result;
    do {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      result = await this.httpService
        .get(
          `https://api.openai.com/v1/threads/${run.thread_id}/runs/${run.id}`,
          {
            headers: headers,
          },
        )
        .toPromise();
      console.log(result.data.status);
    } while (result.data.status !== 'completed');

    const response = await this.httpService
      .get(`https://api.openai.com/v1/threads/${run.thread_id}/messages`, {
        headers: headers,
      })
      .toPromise();

    return JSON.parse(response.data.data[0].content[0].text.value).recipes;
  }

  async createByAI(
    user_id: string,
    recipe: Recipe,
    name: string,
    detail: string,
  ) {
    const user = await this.userService.findById(user_id);
    const newCook = this.cookRepository.create({
      user: user,
      name: name,
      detail: detail,
      ingredients: [...recipe.used_ingredients, ...recipe.needed_ingredients],
      instructions: recipe.instructions,
    });
    return await this.cookRepository.save(newCook);
  }
}
