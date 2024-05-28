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
import { LikeUserRecord } from '../../like/entities/like_user_record.entity';
import { PostImage } from 'src/apis/post_image/entities/postImage.entity';
@Entity()
@ObjectType({ description: '중고물품 정보' })
export class UsedProduct {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: '고유 ID' })
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => User, { description: '판매자 정보' })
  user: User;

  @Column({ length: 100 })
  @Field(() => String, { description: '중고물품 제목' })
  title: string;

  @Column({ default: 0 })
  @Field(() => Int, { description: '중고물품 조회수' })
  view: number;

  @Column({ default: 0 })
  @Field(() => Int, { description: '중고물품 좋아요 수' })
  like: number;

  @Column({ default: 0 })
  @Field(() => Int, { description: '중고물품 가격' })
  price: number;

  @Column('text')
  @Field(() => String, { description: '중고물품 상세설명' })
  detail: string;

  @Column({ length: 50 })
  @Field(() => String, { description: '중고물품 카테고리' })
  category: string;

  @Column({ length: 50 })
  @Field(() => String, {
    description: '중고물품 거래 상태(판매중/예약중/판매완료)',
  })
  state: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date, { description: '중고물품 생성시간' })
  create_at: Date;

  @JoinColumn()
  @OneToMany(
    () => LikeUserRecord,
    (Like_user_record) => Like_user_record.used_product,
    {
      nullable: true,
    },
  )
  @Field(() => [LikeUserRecord], {
    description: '좋아요 기록',
    nullable: true,
  })
  like_user?: LikeUserRecord[];

  @JoinColumn()
  @OneToMany(() => PostImage, (PostImage) => PostImage.used_proudct, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [PostImage], { description: '이미지' })
  post_images: PostImage[];
}
