import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
@ObjectType()
export class Like_user {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToMany(() => User, (users) => users.like_user)
  users: User[];
}
