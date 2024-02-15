import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Used_product } from './used_product.entity';
@Entity()
@ObjectType()
export class Like_user_record {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User, (users) => users.like_user)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Used_product, (Used_products) => Used_products.Like_users)
  @JoinColumn()
  used_product: Used_product;
}
