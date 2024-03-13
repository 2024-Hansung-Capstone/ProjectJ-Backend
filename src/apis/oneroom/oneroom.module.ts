import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sido } from '../area/entities/sido.entity';
import { Sgng } from '../area/entities/sgng.entity';
import { Dong } from '../area/entities/dong.entity';
import { User } from '../users/entities/user.entity';
import { Token } from '../users/entities/token.entity';
import { JwtModule } from '@nestjs/jwt';
import { OneRoomResolver } from './oneroom.resolver';
import { OneRoomService } from './oneroom.service';
import { OneRoomScheduler } from './oneroom.scheduler';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User, Token, Sido, Sgng, Dong]),
    JwtModule.register({}),
  ],
  providers: [OneRoomResolver, OneRoomService, OneRoomScheduler],
})
export class OneRoomModule {}
