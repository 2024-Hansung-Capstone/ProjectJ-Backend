import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { gqlAccessGuard } from '../users/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { IContext } from '../users/interfaces/user-service.interface';
import { OneRoomService } from './oneroom.service';
import { OneRoom } from './entities/one_room.entity';
@Resolver('OneRoom')
export class OneRoomResolver {
  constructor(private readonly oneRoomService: OneRoomService) {}

  @Query(() => [OneRoom])
  async fetchOneRoomFromOpenAPI(
    @Args('LAWD_CD') LAWD_CD: string,
  ): Promise<any> {
    try {
      const data = await this.oneRoomService.fetchOneRoomFromOpenAPI(LAWD_CD);
      return data;
    } catch (error) {
      throw new Error(`데이터를 가져오는데 실패했습니다.: ${error.message}`);
    }
  }

  @Query(() => OneRoom)
  async fetchOneRoomByName(@Args('name') name: string): Promise<OneRoom> {
    return await this.oneRoomService.findByName(name);
  }
}
