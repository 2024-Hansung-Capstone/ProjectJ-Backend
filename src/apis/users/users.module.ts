import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';
import { JwtModule } from '@nestjs/jwt';
import JwtAccessStrategy from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AreaService } from '../area/area.service';
import { Sido } from '../area/entities/sido.entity';
import { Sgng } from '../area/entities/sgng.entity';
import { Dong } from '../area/entities/dong.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token, Sido, Sgng, Dong]),
    JwtModule.register({}),
  ],
  providers: [
    UserService,
    UserResolver,
    AreaService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
})
export class UserModule {}
