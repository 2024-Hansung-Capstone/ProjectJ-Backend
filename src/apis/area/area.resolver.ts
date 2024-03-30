import { Args, Query, Resolver } from '@nestjs/graphql';
import { AreaService } from './area.service';
import { Dong } from './entities/dong.entity';

@Resolver()
export class AreaResolver {
  constructor(private readonly areaService: AreaService) {}

  //동 이름을 입력받아서 해당 정보를 리턴해주는 Api
  @Query(() => Dong)
  async fetchDongByName(@Args('dongName') dongName: string): Promise<Dong> {
    return await this.areaService.findDongByName(dongName);
  }
}
