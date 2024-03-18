import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Letter } from './entities/letter.entity';
import { Repository } from 'typeorm';
import { CreateLetterInput } from './dto/create-letter.input';
import { UserService } from '../users/users.service';
import { UsedProductService } from '../used_markets/usedProducts.service';
import { BoardService } from '../boards/boards.service';
import { ReplyLetterInput } from './dto/reply-letter.input';

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(Letter)
    private readonly letterRepository: Repository<Letter>,
    private readonly userService: UserService,
    private readonly usedProductService: UsedProductService,
    private readonly boardService: BoardService,
  ) {}

  async writeLetter(
    user_id: string,
    writing_id: string,
    createLetterInput: CreateLetterInput,
  ): Promise<Letter> {
    const sender = await this.userService.findById(user_id);
    let letter = null;
    if (createLetterInput.category == '중고마켓') {
      const product = await this.usedProductService.findById(writing_id);
      letter = this.letterRepository.create({
        ...createLetterInput,
        product: product,
        receiver: product.user,
        sender: sender,
      });
    } else if (
      createLetterInput.category == '자취생메이트' ||
      createLetterInput.category == '룸메이트'
    ) {
      const board = await this.boardService.findById(writing_id);
      letter = this.letterRepository.create({
        ...createLetterInput,
        board: board,
        receiver: board.user,
        sender: sender,
      });
    } else {
      throw new BadRequestException('쪽지를 허용하지 않는 카테고리입니다.');
    }

    //쪽지 저장
    return await this.letterRepository.save(letter);
  }

  //쪽지 답장
  async reply(
    user_id: string,
    letter: Letter,
    replyLetterInput: ReplyLetterInput,
  ): Promise<Letter> {
    if (letter.receiver.id != user_id) {
      throw new BadRequestException('잘못된 접근입니다.');
    }
    const reply = await this.letterRepository.create({
      sender: letter.receiver,
      receiver: letter.sender,
      product: letter.product,
      board: letter.board,
      category: letter.category,
      ...replyLetterInput,
    });
    return await this.letterRepository.save(reply);
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

  async findSendAll(user_id: string): Promise<Letter[]> {
    const user = await this.userService.findById(user_id);
    return await this.letterRepository.find({ where: { sender: user } });
  }

  async findReceiveAll(user_id: string): Promise<Letter[]> {
    const user = await this.userService.findById(user_id);
    return await this.letterRepository.find({ where: { receiver: user } });
  }

  async delete(letter_id: string): Promise<boolean> {
    const result = await this.letterRepository.delete({ id: letter_id });
    return result.affected > 0;
  }
}
