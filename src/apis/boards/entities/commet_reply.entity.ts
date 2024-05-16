import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { LikeUserRecord } from 'src/apis/like/entities/like_user_record.entity';
import { Reply } from './reply.entity';

@Entity()
@ObjectType({ description: '대댓글 정보' })
export class CommentReply {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: '고유 ID' })
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => User, { description: '작성자 정보' })
  user: User;

  @ManyToOne(() => Reply, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => Reply, { description: '부모 댓글' })
  reply: Reply;

  @Column('text')
  @Field(() => String, { description: '내용' })
  detail: string;

  @Column({ default: 0 })
  @Field(() => Int, { description: '좋아요 수' })
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

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date, { description: '작성일' })
  create_at: Date;
}
