import { Args, Query, Resolver } from '@nestjs/graphql';
import { AreaService } from './area.service';
import { Dong } from './entities/dong.entity';

@Resolver()
export class AreaResolver {
  constructor(private readonly areaService: AreaService) {}

  @Query(() => Dong, {
    description: '행정동 이름으로 행정동 정보를 조회합니다.',
  })
  async fetchDongByName(
    @Args('dong_name', { description: '행정동 이름' }) dong_name: string,
  ): Promise<Dong> {
    return await this.areaService.findDongByName(dong_name);
  }
}
