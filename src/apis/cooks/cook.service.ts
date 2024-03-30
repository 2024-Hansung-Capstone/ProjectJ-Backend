import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cook } from './entities/cook.entity';
import { UserService } from '../users/users.service';
import { ICookServiceCreate } from './interfaces/cook-service.interface';
import { CreateCookInput } from './dto/create-cook.input';
import { UpdateCookInput } from './dto/update-cook.input';

@Injectable()
export class CookService {
  constructor(
    @InjectRepository(Cook)
    private readonly cookRepository: Repository<Cook>,
    private readonly userService: UserService,
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

  async findByUserId(user_id: string): Promise<Cook> {
    return await this.cookRepository.findOne({
      where: { user: { id: user_id } },
      relations: ['user', 'user.dong', 'user.dong.sgng', 'user.dong.sgng.sido'],
    });
  }
}
