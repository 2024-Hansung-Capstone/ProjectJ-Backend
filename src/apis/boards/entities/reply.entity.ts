import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm'; //typeorm: 데이터베이스 관련
import { User } from '../../users/entities/user.entity';
import { Board } from './board.entity';
import { LikeUserRecord } from 'src/apis/like/entities/like_user_record.entity';
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
    () => LikeUserRecord,
    (Like_user_record) => Like_user_record.reply,
    {
      nullable: true,
    },
  )
  like_user: LikeUserRecord[];

  @CreateDateColumn({ type: 'timestamp' }) // 기본값으로 현재시간을 가져오려면 이렇게 하면 됩니다
  @Field(() => Date)
  create_at: Date;
}
