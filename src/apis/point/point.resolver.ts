import { Resolver, Mutation, Query, Context } from '@nestjs/graphql';
import { PointService } from './point.service';
import { Role } from './entity/role.entity';
import { UseGuards } from '@nestjs/common';
import { gqlAccessGuard } from '../users/guards/gql-auth.guard';
import { IContext } from '../users/interfaces/user-service.interface';

@Resolver()
export class PointResolver {
  constructor(private readonly pointService: PointService) {}

  @Query(() => Role)
  @UseGuards(gqlAccessGuard)
  async fetchMyRole(@Context() context: IContext): Promise<Role> {
    return await this.pointService.findRoleByUserId(context.req.user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(gqlAccessGuard)
  async dailyCheckIn(@Context() context: IContext): Promise<boolean> {
    return await this.pointService.checkIn(context.req.user.id);
  }
}
