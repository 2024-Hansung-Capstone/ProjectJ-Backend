import { BoardService } from 'src/apis/boards/boards.service';
import { NotificationStrategy } from './notification.strategy.interface';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';

export class BoardNotificationStrategy implements NotificationStrategy {
  constructor(
    private boardService: BoardService,
    private notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(
    entity_id: string,
    code: string,
  ): Promise<Notification> {
    const board = await this.boardService.findById(entity_id);
    return await this.notificationRepository.save({
      user: board.user,
      code: code,
      board: board,
    });
  }
}
