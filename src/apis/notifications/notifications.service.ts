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

  /**
   * 알림 생성 서비스 메서드
   * @param entity_id 알림 생성 대상 엔티티의 ID
   * @param code 알림 코드 ex) 100, 200...
   * @returns 생성된 알림 정보
   */
  async create(entity_id: string, code: string): Promise<Notification> {
    const strategy = this.strategies[code];
    if (!strategy) {
      throw new Error('알 수 없는 알림 코드입니다.');
    }
    return await strategy.createNotification(entity_id, code);
  }

  /**
   * 알림 ID 기준 알림 조회 서비스 메서드
   * @param notification_id 조회할 알림 ID
   * @returns 조회된 알림 정보
   */
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

  /**
   * 특정 사용자의 알림 전체 조회 서비스 메서드
   * @param user_id 조회할 사용자 ID
   * @returns 조회된 알림 정보 리스트
   */
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

  /**
   * 알림 ID 기준 알림 삭제 서비스 메서드
   * 본인의 알림인지 확인 과정을 거치고 삭제를 시도
   * @param user_id 삭제를 시도하는 사용자 ID
   * @param notification_id 삭제할 알림 ID
   * @returns 삭제 성공 여부
   */
  async delete(user_id: string, notification_id: string): Promise<boolean> {
    const notification = await this.findById(notification_id);
    if (notification.user.id !== user_id) {
      throw new Error('해당 알림을 삭제할 권한이 없습니다.');
    }
    const result = await this.notificationRepository.delete(notification_id);
    return result.affected > 0;
  }

  /**
   * 특정 사용자의 알림 전체 삭제 서비스 메서드
   * @param user_id 알림을 삭제할 사용자 ID
   * @returns 삭제 성공 여부
   */
  async deleteByUserId(user_id: string): Promise<boolean> {
    const result = await this.notificationRepository.delete({
      user: { id: user_id },
    });
    return result.affected > 0;
  }

  /**
   * 알림 메시지 조회 서비스 메서드
   * 본인의 알림인지 확인 과정을 거치고 알림 ID값으로 알림 메시지를 조회
   * @param user_id 조회할 사용자 ID
   * @param notification_id 조회할 알림 ID
   * @returns 조회된 알림 메시지
   */
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
