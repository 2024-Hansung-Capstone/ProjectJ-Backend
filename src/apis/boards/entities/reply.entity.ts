import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'; //typeorm: 데이터베이스 관련
import { User } from '../../users/entities/user.entity';
import { Board } from './board.entity';
@Entity()
@ObjectType()
export class Reply {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user_id: User;

  @ManyToOne(() => Board, { onDelete: 'CASCADE' })
  board_id: Board;

  @Column('text')
  @Field(() => String)
  detail: string;

  @Column({ default: 0 })
  @Field(() => Int)
  like: number;
}