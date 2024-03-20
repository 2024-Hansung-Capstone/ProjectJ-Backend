import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { gqlAccessGuard } from '../users/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { IContext } from '../users/interfaces/user-service.interface';
import { OneRoomService } from './oneroom.service';
import { OneRoom } from './entities/one_room.entity';
@Resolver('OneRoom')
export class OneRoomResolver {
  constructor(private readonly oneRoomService: OneRoomService) {}

  @Mutation(() => Boolean) // 변경된 부분: 뮤테이션의 반환 타입을 Boolean으로 지정
  async fetchOneRoomFromOpenAPI(
    @Args('LAWD_CD') LAWD_CD: string,
  ): Promise<boolean> {
    await this.oneRoomService.fetchOneRoomFromOpenAPI(LAWD_CD);
    return true; // 변경된 부분: 뮤테이션의 작업이 성공적으로 완료되었음을 나타내기 위해 true 반환
  }

  @Query(() => [OneRoom])
  async fetchOneRoomByXY(
    @Args('StartX') StartX: number,
    @Args('StartY') StartY: number,
    @Args('EndX') EndX: number,
    @Args('EndY') EndY: number,
  ): Promise<OneRoom[]> {
    return await this.oneRoomService.fetchOneRoomByXY(
      StartX,
      StartY,
      EndX,
      EndY,
    );
    // 여기에 함수의 내용을 추가하세요
  }

  @Mutation(() => OneRoom)
  async fetchOneRoomByName(@Args('name') name: string): Promise<OneRoom> {
    return await this.oneRoomService.findByName(name);
  }
}
