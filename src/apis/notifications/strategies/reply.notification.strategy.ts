import { BoardService } from 'src/apis/boards/boards.service';
import { NotificationStrategy } from './notification.strategy.interface';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';

export class ReplyNotificationStrategy implements NotificationStrategy {
  constructor(
    private boardService: BoardService,
    private notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(
    entity_id: string,
    code: string,
  ): Promise<Notification> {
    const reply = await this.boardService.findReplyById(entity_id);
    return await this.notificationRepository.save({
      user: reply.board.user,
      code: code,
      board: reply.board,
      reply: reply,
    });
  }
}
