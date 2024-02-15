import { Module } from '@nestjs/common';
import { AreaResolver } from './area.resolver';
import { AreaService } from './area.service';
import { Sido } from './entities/sido.entity';
import { Sgng } from './entities/sgng.entity';
import { Dong } from './entities/dong.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Sido, Sgng, Dong])],
  providers: [AreaResolver, AreaService],
})
export class AreaModule {}
