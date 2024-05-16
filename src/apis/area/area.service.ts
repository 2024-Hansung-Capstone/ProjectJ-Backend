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

  /**
   * 행정동 코드로 행정동 정보 조회 서비스 메서드
   * @param dong_code 행정동 코드
   * @returns 행정동 정보
   */
  async findDongByCode(dong_code: string): Promise<Dong> {
    return await this.dongRepository.findOne({
      where: { id: dong_code },
      relations: ['sgng', 'sgng.sido'],
    });
  }
}
