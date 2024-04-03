import {
  Resolver,
  Query,
  Mutation,
  Args,
  Float,
  Context,
} from '@nestjs/graphql';

import { OneRoomService } from './oneroom.service';
import { OneRoom } from './entities/one_room.entity';
import { SearchOneRoomInput } from './dto/serach-oneRoom.input';
@Resolver('OneRoom')
export class OneRoomResolver {
  constructor(private readonly oneRoomService: OneRoomService) {}

  @Mutation(() => Boolean, {
    description:
      '해당 지역에 원룸들을 OpenApi를 통해 가져옴(중복된 원룸자료들은 DB에 저장 X)',
  })
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

  @Query(() => [OneRoom], {
    description:
      '해당 X,Y좌표에 포함되어 있는 원룸들을 리턴(X,Y좌표는 소수점 14자리수 까지)',
  })
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

  @Query(() => [OneRoom], {
    description:
      '검색조건으로 지도좌표에 있는 원룸 검색이나 전체 원룸 검색하는 기능',
  })
  async fetchOneRoomBySerach(
    @Args('SerachUsedProductInput') SearchOneRoomInput: SearchOneRoomInput,
    @Context('oneRooms') oneRooms: OneRoom[],
  ): Promise<OneRoom[]> {
    if (!oneRooms) {
      oneRooms = [];
    }
    return this.oneRoomService.findBySerach(SearchOneRoomInput, oneRooms);
  }

  @Query(() => [OneRoom], {
    description: '모든 원룸을 가져오는 기능.',
  })
  async fetchOneRooms(): Promise<OneRoom[]> {
    return this.oneRoomService.findAll();
  }

  @Query(() => OneRoom)
  async fetchOneRoomById(@Args('id') id: string): Promise<OneRoom> {
    return this.oneRoomService.findById(id);
  }

  @Mutation(() => OneRoom, {
    description: '원룸의 조회수를 1 증가시킵니다.',
  })
  inceaseOneRoomView(@Args('oneRoom_id') oneRoom_id: string): Promise<OneRoom> {
    return this.oneRoomService.addViewCount(oneRoom_id);
  }

  @Query(() => [OneRoom], {
    description: '조회수가 많은 원룸 rank개를 리턴',
  })
  async fetchOneRoomsByViewRank(
    @Args('rank') rank: number,
  ): Promise<OneRoom[]> {
    return this.oneRoomService.findTopOneRooms(rank);
  }
}
