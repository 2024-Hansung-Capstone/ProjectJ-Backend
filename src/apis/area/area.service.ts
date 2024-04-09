import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Dong } from './entities/dong.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Dong)
    private readonly dongRepository: Repository<Dong>,
  ) {}

  /**
   * 행정동 이름으로 행정동 정보 조회 서비스 메서드
   * @param dong_name 행정동 이름
   * @returns 행정동 정보
   */
  async findDongByName(dong_name: string): Promise<Dong> {
    return await this.dongRepository.findOne({
      where: { name: dong_name },
      relations: ['sgng', 'sgng.sido'],
    });
  }
}
