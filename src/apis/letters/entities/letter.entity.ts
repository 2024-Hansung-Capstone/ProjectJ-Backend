import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/boards/entities/board.entity';
import { UsedProduct } from 'src/apis/used_markets/entities/used_product.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType({ description: '쪽지 정보' })
export class Letter {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: '고유 ID' })
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => User, { description: '보낸 사람 정보' })
  sender: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => User, { description: '받는 사람 정보' })
  receiver: User;

  @ManyToOne(() => UsedProduct, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn()
  @Field(() => UsedProduct, { nullable: true, description: '중고 상품 정보' })
  product?: UsedProduct;

  @ManyToOne(() => Board, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn()
  @Field(() => Board, { nullable: true, description: '게시글 정보' })
  board?: Board;

  @Column()
  @Field(() => String, {
    description: '쪽지 카테고리(중고마켓, 자취생메이트, 룸메이트)',
  })
  category: string;

  @Column()
  @Field(() => String, { description: '제목' })
  title: string;

  @Column()
  @Field(() => String, { description: '내용' })
  detail: string;

  @Column({ default: false })
  @Field(() => Boolean, { description: '읽음 여부' })
  is_read: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date, { description: '작성일' })
  create_at: Date;
}
