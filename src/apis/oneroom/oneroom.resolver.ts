import { Resolver, Query, Mutation, Args, Float } from '@nestjs/graphql';

import { OneRoomService } from './oneroom.service';
import { OneRoom } from './entities/one_room.entity';
import { SearchOneRoomInput } from './dto/serach-oneRoom.input';
@Resolver('OneRoom')
export class OneRoomResolver {
  constructor(private readonly oneRoomService: OneRoomService) {}

  @Mutation(() => Boolean)
  async fetchOneRoomFromOpenAPI(
    @Args('LAWD_CD') LAWD_CD: string,
  ): Promise<boolean> {
    try {
      await this.oneRoomService.fetchOneRoomFromOpenAPI(LAWD_CD);
      return true;
    } catch (error) {
      console.error('OpenApi로 부터 데이터를 가져오는 중 오류 발생:', error);
      return false;
    }
  }

  @Query(() => [OneRoom])
  async fetchOneRoomByXY(
    @Args('StartX', { type: () => Float }) StartX: number,
    @Args('StartY', { type: () => Float }) StartY: number,
    @Args('EndX', { type: () => Float }) EndX: number,
    @Args('EndY', { type: () => Float }) EndY: number,
  ): Promise<OneRoom[]> {
    return await this.oneRoomService.fetchOneRoomByXY(
      StartX,
      StartY,
      EndX,
      EndY,
    );
  }

  @Query(() => [OneRoom])
  async fetchOneRoomBySerach(
    @Args('SerachUsedProductInput') SearchOneRoomInput: SearchOneRoomInput,
  ): Promise<OneRoom[]> {
    return this.oneRoomService.findBySerach(SearchOneRoomInput);
  }

  @Query(() => [OneRoom], {
    description: '모든 원룸을 가져옵니다.',
  })
  async fetchOneRooms(): Promise<OneRoom[]> {
    return this.oneRoomService.findAll();
  }
}
