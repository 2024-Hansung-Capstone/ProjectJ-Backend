import { Notification } from '../entities/notification.entity';

export interface NotificationStrategy {
  createNotification(entity_id: string, code: string): Promise<Notification>;
}
