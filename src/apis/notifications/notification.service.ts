import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LetterService } from '../letters/letters.service';
import { UserService } from '../users/users.service';
import { BoardService } from '../boards/boards.service';
import { LikeUserRecordService } from '../like/like_user_record.service';
import { Notification } from './entities/notification.entity';
import { NotificationStrategy } from './strategies/notification.strategy.interface';
import { UserNotificationStrategy } from './strategies/user.notification.strategy';
import { LikeNotificationStrategy } from './strategies/like.notification.strategy';
import { BoardNotificationStrategy } from './strategies/board.notification.strategy';
import { LetterNotificationStrategy } from './strategies/letter.notification.strategy';
import { NotificationMessages } from './notification.messages';

@Injectable()
export class NotificationService {
  private strategies: Record<string, NotificationStrategy>;

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    //private readonly letterService: LetterService,
    private readonly userService: UserService,
    private readonly boardService: BoardService,
    private readonly likeUserRecordService: LikeUserRecordService,
    private readonly notificationMessages: NotificationMessages,
  ) {
    this.strategies = {
      '100': new UserNotificationStrategy(userService, notificationRepository),
      '200': new LikeNotificationStrategy(
        likeUserRecordService,
        notificationRepository,
      ),
      '201': new LikeNotificationStrategy(
        likeUserRecordService,
        notificationRepository,
      ),
      '300': new BoardNotificationStrategy(
        boardService,
        notificationRepository,
      ),
      '301': new LikeNotificationStrategy(
        likeUserRecordService,
        notificationRepository,
      ),
      // '400': new LetterNotificationStrategy(
      //   letterService,
      //   notificationRepository,
      // ),
    };
  }

  async create(entity_id: string, code: string): Promise<Notification> {
    const strategy = this.strategies[code];
    if (!strategy) {
      throw new Error('알 수 없는 알림 코드입니다.');
    }
    return await strategy.createNotification(entity_id, code);
  }

  async findById(notification_id: string): Promise<Notification[]> {
    // return await this.notificationRepository.find({
    //   where: { id: user_id },
    // });
    return null;
  }

  async delete(notification_id: string): Promise<void> {
    await this.notificationRepository.delete(notification_id);
  }
}
