import { Inject, Injectable, forwardRef } from '@nestjs/common';
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
import { LetterNotificationStrategy } from './strategies/letter.notification.strategy';
import { NotificationMessages } from './notifications.messages';
import { ReplyNotificationStrategy } from './strategies/reply.notification.strategy';

@Injectable()
export class NotificationService {
  private strategies: Record<string, NotificationStrategy>;

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @Inject(forwardRef(() => LetterService))
    private readonly letterService: LetterService,
    @Inject(forwardRef(() => UserService))
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
      '202': new LikeNotificationStrategy(
        likeUserRecordService,
        notificationRepository,
      ),
      '203': new LikeNotificationStrategy(
        likeUserRecordService,
        notificationRepository,
      ),
      '300': new ReplyNotificationStrategy(
        boardService,
        notificationRepository,
      ),
      '400': new LetterNotificationStrategy(
        letterService,
        notificationRepository,
      ),
    };
  }

  async create(entity_id: string, code: string): Promise<Notification> {
    const strategy = this.strategies[code];
    if (!strategy) {
      throw new Error('알 수 없는 알림 코드입니다.');
    }
    return await strategy.createNotification(entity_id, code);
  }

  async findById(notification_id: string): Promise<Notification> {
    return await this.notificationRepository.findOne({
      where: { id: notification_id },
      relations: [
        'user',
        'like',
        'like.user',
        'like.used_product',
        'board',
        'letter',
        'letter.sender',
        'letter.receiver',
        'letter.product',
        'letter.board',
        'used_product',
        'reply',
        'reply.user',
        'reply.board',
      ],
    });
  }

  async findByUserId(user_id: string): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { user: { id: user_id } },
      relations: [
        'user',
        'like',
        'like.user',
        'like.used_product',
        'like.board',
        'like.reply',
        'like.reply.board',
        'like.reply.user',
        'board',
        'letter',
      ],
    });
  }

  async delete(user_id: string, notification_id: string): Promise<boolean> {
    const notification = await this.findById(notification_id);
    if (notification.user.id !== user_id) {
      throw new Error('해당 알림을 삭제할 권한이 없습니다.');
    }
    const result = await this.notificationRepository.delete(notification_id);
    return result.affected > 0;
  }

  async deleteByUserId(user_id: string): Promise<boolean> {
    const result = await this.notificationRepository.delete({
      user: { id: user_id },
    });
    return result.affected > 0;
  }

  async getMessage(user_id: string, notification_id: string): Promise<string> {
    const notification = await this.findById(notification_id);
    const strategy = this.strategies[notification.code];

    if (user_id !== notification.user.id) {
      throw new Error('해당 알림을 볼 권한이 없습니다.');
    }
    if (!strategy) {
      throw new Error('알 수 없는 알림 코드입니다.');
    }

    return await this.notificationMessages.getMessage(notification);
  }
}
