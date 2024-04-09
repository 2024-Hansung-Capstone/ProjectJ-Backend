import { LikeUserRecordService } from 'src/apis/like/like_user_record.service';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { NotificationStrategy } from './notification.strategy.interface';

export class LikeNotificationStrategy implements NotificationStrategy {
  constructor(
    private likeUserRecordService: LikeUserRecordService,
    private notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(
    entity_id: string,
    code: string,
  ): Promise<Notification> {
    if (code === '200') {
      const like = await this.likeUserRecordService.findById(entity_id);
      return await this.notificationRepository.save({
        user: like.used_product.user,
        code: code,
        like: like,
        board: like.board,
        product: like.used_product,
      });
    } else if (code === '201') {
      const like = await this.likeUserRecordService.findById(entity_id);
      return await this.notificationRepository.save({
        user: like.user,
        code: code,
        like: like,
        board: like.board,
        product: like.used_product,
      });
    } else if (code === '202') {
      const like = await this.likeUserRecordService.findById(entity_id);
      return await this.notificationRepository.save({
        user: like.board.user,
        code: code,
        like: like,
        board: like.board,
        product: like.used_product,
      });
    }
  }
}
