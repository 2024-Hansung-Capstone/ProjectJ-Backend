import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import JwtAccessStrategy from './strategies/jwt-acess.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { Token } from './entities/token.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Token]), JwtModule.register({})],
  providers: [UserService, UserResolver, JwtAccessStrategy, JwtRefreshStrategy],
})
export class UserModule {}
