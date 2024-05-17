import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
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
import { PostImageService } from '../post_image/postImage.service';

@Injectable()
export class CookService {
  private imageFolder = 'cook';

  constructor(
    @InjectRepository(Cook)
    private readonly cookRepository: Repository<Cook>,
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
    private readonly userService: UserService,
    private readonly postImageService: PostImageService,
    private httpService: HttpService,
  ) {}

  async create(
    user_id: string,
    createCookInput: CreateCookInput,
  ): Promise<Cook> {
    const user = await this.userService.findById(user_id);
    const cook = await this.cookRepository.save({
      user: user,
      name: createCookInput.name,
      detail: createCookInput.detail,
      post_images: [],
    });

    const files = await Promise.all(createCookInput.post_images);

    for (const file of files) {
      const url = await this.postImageService.saveImageToS3(
        this.imageFolder,
        file,
      );
      const postImage = await this.postImageService.createPostImage(url, cook);
      cook.post_images.push(postImage);
    }
    return await this.cookRepository.save(cook);
  }

  async update(
    user_id: string,
    cook_id: string,
    updateCookInput: UpdateCookInput,
  ): Promise<Cook> {
    const cook = await this.findById(cook_id);
    if (!cook) {
      throw new BadRequestException('수정해야 할 게시글을 찾을 수 없습니다.');
    }
    if (cook.user.id !== user_id) {
      throw new ForbiddenException(
        `본인이 작성한 게시글만 수정할 수 있습니다.`,
      );
    }

    if (updateCookInput.post_images) {
      // 기존 이미지 삭제
      for (const postImage of cook.post_images) {
        await this.postImageService.deleteImageFromS3(postImage.imagePath);
        await this.postImageService.removePostImage(postImage.id);
      }
      const files = await Promise.all(updateCookInput.post_images);
      for (const file of files) {
        const url = await this.postImageService.saveImageToS3(
          this.imageFolder,
          file,
        );
        const postImage = await this.postImageService.createPostImage(
          url,
          cook,
        );
        cook.post_images.push(postImage);
      }
    }

    const result = await this.cookRepository.update(
      { id: cook_id },
      {
        name: updateCookInput.name,
        detail: updateCookInput.detail,
        post_images: cook.post_images,
      },
    );

    if (result.affected > 0) {
      return await this.findById(cook_id);
    }
    return null;
  }

  async delete(user_id: string, cook_id: string): Promise<boolean> {
    const cook = await this.findById(cook_id);
    if (cook.user.id !== user_id) {
      throw new ForbiddenException(
        `본인이 작성한 게시글만 삭제할 수 있습니다.`,
      );
    }
    for (const postImage of cook.post_images) {
      await this.postImageService.deleteImageFromS3(postImage.imagePath);
    }
    const result = await this.cookRepository.delete(cook_id);
    return result.affected > 0;
  }

  async findAll(): Promise<Cook[]> {
    return await this.cookRepository.find({
      order: { create_at: 'DESC' },
      relations: [
        'user',
        'user.dong',
        'user.dong.sgng',
        'user.dong.sgng.sido',
        'post_images',
        'post_images.cook',
      ],
    });
  }

  async findById(cook_id: string): Promise<Cook> {
    return await this.cookRepository.findOne({
      where: { id: cook_id },
      relations: [
        'user',
        'user.dong',
        'user.dong.sgng',
        'user.dong.sgng.sido',
        'post_images',
        'post_images.cook',
      ],
    });
  }

  async findByUserId(user_id: string): Promise<Cook[]> {
    return await this.cookRepository.find({
      where: { user: { id: user_id } },
      relations: [
        'user',
        'user.dong',
        'user.dong.sgng',
        'user.dong.sgng.sido',
        'post_images',
        'post_images.cook',
      ],
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
}
