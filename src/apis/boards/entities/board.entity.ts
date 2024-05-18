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
import { LikeUserRecord } from 'src/apis/like/entities/like_user_record.entity';
import { Reply } from './reply.entity';
import { PostImage } from 'src/apis/post_image/entities/postImage.entity';
@Entity()
@ObjectType({ description: '게시글 정보' })
export class Board {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: '고유 ID' })
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => User, { description: '작성자 정보' })
  user: User;

  @Column({ length: 50 })
  @Field(() => String, { description: '카테고리' })
  category: string;

  @Column({ length: 100 })
  @Field(() => String, { description: '제목' })
  title: string;

  @Column('text')
  @Field(() => String, { description: '내용' })
  detail: string;

  @Column({ default: 0 })
  @Field(() => Int, { description: '조회수' })
  view: number;

  @Column({ default: 0 })
  @Field(() => Int, { description: '좋아요 수' })
  like: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date, { description: '작성일' })
  create_at: Date;

  @JoinColumn()
  @OneToMany(
    () => LikeUserRecord,
    (Like_user_record) => Like_user_record.board,
    {
      nullable: true,
    },
  )
  @Field(() => [LikeUserRecord], { description: '좋아요 기록', nullable: true })
  like_user: LikeUserRecord[];

  @JoinColumn()
  @OneToMany(() => Reply, (Reply) => Reply.board, {
    nullable: true,
  })
  @Field(() => [Reply], { description: '댓글 정보', nullable: true })
  reply: Reply[];

  @JoinColumn()
  @OneToMany(() => PostImage, (PostImage) => PostImage.board, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [PostImage], { description: '이미지' })
  post_images: PostImage[];
}
