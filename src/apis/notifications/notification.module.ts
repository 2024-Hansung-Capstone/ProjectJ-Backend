import { Module } from '@nestjs/common';
import { NotificationResolver } from './notification.resolver';
import { CommonModule } from '../common.module';
import { LetterNotificationStrategy } from './strategies/letter.notification.strategy';
import { LikeNotificationStrategy } from './strategies/like.notification.strategy';
import { UserNotificationStrategy } from './strategies/user.notification.strategy';
import { NotificationMessages } from './notification.messages';
import { ReplyNotificationStrategy } from './strategies/reply.notification.strategy';

@Module({
  imports: [CommonModule, NotificationMessages],
  providers: [
    NotificationResolver,
    LetterNotificationStrategy,
    LikeNotificationStrategy,
    UserNotificationStrategy,
    ReplyNotificationStrategy,
  ],
})
export class NotificationModule {}
