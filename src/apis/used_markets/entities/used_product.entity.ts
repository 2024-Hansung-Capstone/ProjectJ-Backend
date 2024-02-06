import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Like_user } from './like_user.entity';
@Entity()
@ObjectType()
export class Used_product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @Field(() => User)
  user_id: User;

  @Column({ length: 100 })
  @Field(() => String)
  title: string;

  @Column({ default: 0 })
  @Field(() => Int)
  price: number;

  @Column('text')
  @Field(() => String)
  detail: string;

  @Column({ length: 50 })
  @Field(() => String)
  category: string;

  @Column({ length: 50 })
  @Field(() => String)
  state: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  create_at: Date;

  @JoinColumn()
  @OneToOne(() => Like_user)
  Like_users: Like_user;
}
