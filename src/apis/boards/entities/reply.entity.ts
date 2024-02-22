import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm'; //typeorm: 데이터베이스 관련
import { User } from '../../users/entities/user.entity';
import { Board } from './board.entity';
import { Like_user_record } from 'src/apis/used_markets/entities/like_user_record.entity';
@Entity()
@ObjectType()
export class Reply {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Board, { onDelete: 'CASCADE' })
  board: Board;

  @Column('text')
  @Field(() => String)
  detail: string;

  @Column({ default: 0 })
  @Field(() => Int)
  like: number;

  @JoinColumn()
  @OneToMany(
    () => Like_user_record,
    (Like_user_record) => Like_user_record.user,
    {
      nullable: true,
    },
  )
  likeUsers: Like_user_record[] | null;
}
