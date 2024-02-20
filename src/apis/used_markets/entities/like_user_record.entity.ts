import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UsedProduct } from './used_product.entity';
@Entity()
@ObjectType()
export class Like_user_record {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User, (users) => users.like_user)
  @JoinColumn()
  user: User;

  @ManyToOne(() => UsedProduct, (Used_products) => Used_products.Like_users)
  @JoinColumn()
  used_product: UsedProduct;
}
