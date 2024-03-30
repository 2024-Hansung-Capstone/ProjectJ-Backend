import { UserService } from 'src/apis/users/users.service';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { NotificationStrategy } from './notification.strategy.interface';

export class UserNotificationStrategy implements NotificationStrategy {
  constructor(
    private userService: UserService,
    private notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(
    entity_id: string,
    code: string,
  ): Promise<Notification> {
    const user = await this.userService.findById(entity_id);
    return await this.notificationRepository.save({
      user: user,
      code: code,
    });
  }
}
