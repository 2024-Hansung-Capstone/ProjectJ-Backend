import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Letter } from './entities/letter.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateLetterInput } from './dto/create-letter.input';
import { UserService } from '../users/users.service';

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(Letter)
    private readonly letterRepository: Repository<Letter>,
    private readonly userService: UserService,
  ) {}

  async writeLetter(
    user_id: string,
    createLetterInput: CreateLetterInput,
  ): Promise<Letter> {
    const sender = await this.userService.findById(user_id);
    //생성할 쪽지 생성
    const letter = this.letterRepository.create({
      ...createLetterInput,
      sender: sender,
    });

    //쪽지 저장
    return await this.letterRepository.save(letter);
  }

  async findById(letter_id: string): Promise<Letter> {
    const letter = await this.letterRepository.findOne({
      where: { id: letter_id },
    });

    if (!letter) {
      throw new NotFoundException('쪽지를 찾을 수 없습니다.');
    }
    return letter;
  }
}
