import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Like_user_record } from './like_user_record.entity';
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
  view: number;

  @Column({ default: 0 })
  @Field(() => Int)
  like: number;

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
  @OneToMany(
    () => Like_user_record,
    (Like_user_record) => Like_user_record.user,
  )
  Like_users: Like_user_record[];
}
