import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  @Field(() => User, { nullable: true })
  user: User;

  @Column()
  @Field(() => String)
  phone_number: string;

  @Column()
  @Field(() => String)
  token: string;

  @Column({ default: false })
  @Field(() => Boolean)
  is_auth: boolean;
}
