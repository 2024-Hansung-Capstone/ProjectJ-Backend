import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notifications.service';
import { UseGuards } from '@nestjs/common';
import { gqlAccessGuard } from '../users/guards/gql-auth.guard';
import { IContext } from '../users/interfaces/user-service.interface';

@Resolver()
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(gqlAccessGuard)
  @Query(() => String, { description: '알림 메시지 조회' })
  async getNotificationMessage(
    @Context() context: IContext,
    @Args('notification_id', { description: '알림 고유 ID' })
    notification_id: string,
  ): Promise<string> {
    return await this.notificationService.getMessage(
      context.req.user.id,
      notification_id,
    );
  }
}
