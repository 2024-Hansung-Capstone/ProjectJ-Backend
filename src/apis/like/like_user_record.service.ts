import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeUserRecord } from './entities/like_user_record.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeUserRecordService {
  constructor(
    @InjectRepository(LikeUserRecord)
    private likeUserRecordRepository: Repository<LikeUserRecord>,
  ) {}

  async findAll(): Promise<LikeUserRecord[]> {
    return await this.likeUserRecordRepository.find({
      relations: ['user', 'used_product', 'board', 'reply'],
    });
  }

  async findById(id: string): Promise<LikeUserRecord> {
    return await this.likeUserRecordRepository.findOne({
      where: { id: id },
      relations: [
        'user',
        'used_product',
        'used_product.user',
        'board',
        'reply',
        'board.user',
      ],
    });
  }

  async findByUserId(user_id: string): Promise<LikeUserRecord[]> {
    return await this.likeUserRecordRepository.find({
      where: { user: { id: user_id } },
      relations: ['user', 'used_product', 'board', 'reply'],
    });
  }

  async findByUsedProductId(
    used_product_id: string,
  ): Promise<LikeUserRecord[]> {
    return await this.likeUserRecordRepository.find({
      where: { used_product: { id: used_product_id } },
      relations: ['user', 'used_product', 'board', 'reply'],
    });
  }

  async findByBoardId(board_id: string): Promise<LikeUserRecord[]> {
    return await this.likeUserRecordRepository.find({
      where: { board: { id: board_id } },
      relations: ['user', 'used_product', 'board', 'reply'],
    });
  }

  async findByReplyId(reply_id: string): Promise<LikeUserRecord[]> {
    return await this.likeUserRecordRepository.find({
      where: { reply: { id: reply_id } },
      relations: ['user', 'used_product', 'board', 'reply'],
    });
  }
}
