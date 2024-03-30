import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Sido } from './entities/sido.entity';
import { Sgng } from './entities/sgng.entity';
import { Dong } from './entities/dong.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Sido)
    private readonly sidoRepository: Repository<Sido>,
    @InjectRepository(Sgng)
    private readonly sgngRepository: Repository<Sgng>,
    @InjectRepository(Dong)
    private readonly dongRepository: Repository<Dong>,
  ) {}

  //Repository에서 find한 결과 내에서 조인된 테이블 정보를 타고 타면서 원하는 데이터를 가져옴

  async findDongByName(dongName: string): Promise<Dong> {
    return await this.dongRepository.findOne({
      where: { name: dongName },
      relations: ['sgng', 'sgng.sido'],
    });
  }
}
