import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'; //typeorm: 데이터베이스 관련
import { User } from '../../users/entities/user.entity';

@Entity()
@ObjectType()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user_id: User;

  @Column({ length: 50 })
  @Field(() => String)
  category: string;

  @Column({ length: 100 })
  @Field(() => String)
  title: string;

  @Column('text')
  @Field(() => String)
  detail: string;

  @Column({ default: 0 })
  @Field(() => Int)
  view: number;

  @Column({ default: 0 })
  @Field(() => Int)
  like: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  create_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  updated_at: Date;
}
