import { LetterService } from 'src/apis/letters/letters.service';
import { NotificationStrategy } from './notification.strategy.interface';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';

export class LetterNotificationStrategy implements NotificationStrategy {
  constructor(
    private letterService: LetterService,
    private notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(
    entity_id: string,
    code: string,
  ): Promise<Notification> {
    console.log('--->>', entity_id, code);
    const letter = await this.letterService.findById(entity_id);
    return await this.notificationRepository.save({
      user: letter.receiver,
      code: code,
      letter: letter,
    });
  }
}
