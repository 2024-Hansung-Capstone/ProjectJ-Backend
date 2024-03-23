import { Context, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { UseGuards } from '@nestjs/common';
import { gqlAccessGuard } from '../users/guards/gql-auth.guard';
import { IContext } from '../users/interfaces/user-service.interface';

@Resolver()
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(gqlAccessGuard)
  @Query(() => [Notification])
  async getNotifications(
    @Context() context: IContext,
  ): Promise<Notification[]> {
    return await this.notificationService.findNotificationById(
      context.req.user.id,
    );
  }

  @UseGuards(gqlAccessGuard)
  
}
