import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Dong } from './entities/dong.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Sgng } from './entities/sgng.entity';
import { Sido } from './entities/sido.entity';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Dong)
    private readonly dongRepository: Repository<Dong>,
    @InjectRepository(Sgng)
    private readonly sgngRepository: Repository<Sgng>,
    @InjectRepository(Sido)
    private readonly sidoRepository: Repository<Sido>,
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

  /**
   * 전체 시도 정보 조회 서비스 메서드
   * @returns 전체 시도 정보
   */
  async findAllSido(): Promise<Sido[]> {
    return await this.sidoRepository.find();
  }

  /**
   * 전체 시군구 정보 조회 서비스 메서드
   * @returns 전체 시군구 정보
   */
  async findAllSgng(): Promise<Sgng[]> {
    return await this.sgngRepository.find({ relations: ['sido'] });
  }

  /**
   * 전체 행정동 정보 조회 서비스 메서드
   * @returns 전체 행정동 정보
   */
  async findAllDong(): Promise<Dong[]> {
    return await this.dongRepository.find({ relations: ['sgng', 'sgng.sido'] });
  }
}
