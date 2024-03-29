import { Module } from '@nestjs/common';
import { NotificationResolver } from './notification.resolver';
import { CommonModule } from '../common.module';
import { BoardNotificationStrategy } from './strategies/board.notification.strategy';
import { LetterNotificationStrategy } from './strategies/letter.notification.strategy';
import { LikeNotificationStrategy } from './strategies/like.notification.strategy';
import { UserNotificationStrategy } from './strategies/user.notification.strategy';
import { NotificationMessages } from './notification.messages';

@Module({
  imports: [CommonModule, NotificationMessages],
  providers: [
    NotificationResolver,
    BoardNotificationStrategy,
    LetterNotificationStrategy,
    LikeNotificationStrategy,
    UserNotificationStrategy,
    ,
  ],
})
export class notificationModule {}
