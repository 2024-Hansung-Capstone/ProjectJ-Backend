import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  providers: [UserService, UserResolver],
})
export class UserModule {}
