import { Args, Query, Resolver } from '@nestjs/graphql';
import { AreaService } from './area.service';
import { Dong } from './entities/dong.entity';
import { Sgng } from './entities/sgng.entity';
import { Sido } from './entities/sido.entity';

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

  @Query(() => [Sido], {
    description: '전체 시도 정보를 조회합니다.',
  })
  async fetchAllSido(): Promise<Sido[]> {
    return await this.areaService.findAllSido();
  }

  @Query(() => [Sgng], {
    description: '전체 시군구 정보를 조회합니다.',
  })
  async fetchAllSgng(): Promise<Sgng[]> {
    return await this.areaService.findAllSgng();
  }

  @Query(() => [Dong], {
    description: '전체 행정동 정보를 조회합니다.',
  })
  async fetchAllDong(): Promise<Dong[]> {
    return await this.areaService.findAllDong();
  }
}
