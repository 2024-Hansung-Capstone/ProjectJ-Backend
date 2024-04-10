import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notifications.service';
import { UseGuards } from '@nestjs/common';
import { gqlAccessGuard } from '../users/guards/gql-auth.guard';
import { IContext } from '../users/interfaces/user-service.interface';
import { Notification } from './entities/notification.entity';

@Resolver()
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(gqlAccessGuard)
  @Query(() => String, { description: '특정 알림의 메시지를 조회합니다.' })
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

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Boolean, { description: '특정 알림을 삭제합니다.' })
  async deleteNotificationMessage(
    @Context() context: IContext,
    @Args('notification_id', { description: '알림 고유 ID' })
    notification_id: string,
  ): Promise<boolean> {
    return await this.notificationService.delete(
      context.req.user.id,
      notification_id,
    );
  }

  @UseGuards(gqlAccessGuard)
  @Query(() => [Notification], {
    description: '나의 알림을 전체 조회합니다.',
  })
  async fetchMyNotificationMessages(
    @Context() context: IContext,
  ): Promise<Notification[]> {
    return await this.notificationService.findByUserId(context.req.user.id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Boolean, { description: '나의 알림을 전체 삭제합니다.' })
  async deleteAllMyNotificationMessages(
    @Context() context: IContext,
  ): Promise<boolean> {
    return await this.notificationService.deleteByUserId(context.req.user.id);
  }
}
