import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LetterService } from '../letters/letters.service';
import { UserService } from '../users/users.service';
import { BoardService } from '../boards/boards.service';
import { UsedProductService } from '../used_markets/usedProducts.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly letterService: LetterService,
    private readonly userService: UserService,
    private readonly boardService: BoardService,
    private readonly usedProductService: UsedProductService,
  ) {}

  async createNotification(
    user_id: string,
    letter: string,
  ): Promise<Notification[]> {
    const user = await this.userService.findById(user_id);
    const notification = this.notificationRepository.create({
      user: user,
      letter: letter,
    });
    return await this.notificationRepository.save(notification);
  }

  async findNotificationById(user_id: string): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { id: user_id },
    });
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await this.notificationRepository.delete(notificationId);
  }
}
