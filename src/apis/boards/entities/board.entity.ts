import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm'; //typeorm: 데이터베이스 관련
import { User } from '../../users/entities/user.entity';
import { LikeUserRecord } from 'src/apis/like/entities/like_user_record.entity';
import { Reply } from './reply.entity';
@Entity()
@ObjectType()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

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
  createat: Date;

  @JoinColumn()
  @OneToMany(
    () => LikeUserRecord,
    (Like_user_record) => Like_user_record.board,
    {
      nullable: true,
    },
  )
  like_user: LikeUserRecord[];

  @JoinColumn()
  @OneToMany(() => Reply, (Reply) => Reply.board, {
    nullable: true,
  })
  reply: Reply[];
}
