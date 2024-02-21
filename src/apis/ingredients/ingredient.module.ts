import { Module } from '@nestjs/common';
import { IngredientResolver } from './ingredient.resolver';
import { IngredientService } from './ingredient.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { UserService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Sido } from '../area/entities/sido.entity';
import { Sgng } from '../area/entities/sgng.entity';
import { Dong } from '../area/entities/dong.entity';
import { Token } from 'graphql';
import { JwtModule } from '@nestjs/jwt';
import { AreaService } from '../area/area.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ingredient, User, Token, Sido, Sgng, Dong]),
    JwtModule.register({}),
  ],
  providers: [IngredientResolver, IngredientService, UserService, AreaService],
})
export class IngredientModule {}
