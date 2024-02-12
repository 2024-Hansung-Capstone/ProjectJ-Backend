import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Used_product } from '../used_markets/entities/used_product.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User]), Used_product],
  providers: [UserService, UserResolver],
})
export class UserModule {}
