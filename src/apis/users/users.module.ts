import { Module } from '@nestjs/common';
import { UserResolver } from './users.resolver';
import JwtAccessStrategy from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { CommonModule } from '../common.module';

@Module({
  imports: [CommonModule],
  providers: [UserResolver, JwtAccessStrategy, JwtRefreshStrategy],
})
export class UserModule {}
