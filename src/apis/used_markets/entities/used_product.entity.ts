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
@ObjectType({ description: '중고거래 데이터 엔티티' })
export class UsedProduct {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: '중고물품 고유 식별번호' })
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
  @Field(() => String, { description: '중고물품 판매상태' })
  state: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date, { description: '중고물품 생성시간' })
  create_at: Date;

  @JoinColumn()
  @OneToMany(
    () => Like_user_record,
    (Like_user_record) => Like_user_record.used_product,
    {
      nullable: true,
    },
  )
  like_user: Like_user_record[];
}
