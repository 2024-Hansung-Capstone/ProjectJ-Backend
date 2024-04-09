import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/boards/entities/board.entity';
import { Reply } from 'src/apis/boards/entities/reply.entity';
import { Letter } from 'src/apis/letters/entities/letter.entity';
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
@ObjectType()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: '고유 ID' })
  id: string;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn()
  @Field(() => User, { description: '받는 사람 정보' })
  user: User;

  @ManyToOne(() => Letter, { cascade: true, nullable: true })
  @JoinColumn()
  @Field(() => Letter, {
    nullable: true,
    description: '알림이 생성된 쪽지 정보',
  })
  letter?: Letter;

  @ManyToOne(() => Board, { cascade: true, nullable: true })
  @JoinColumn()
  @Field(() => Board, {
    nullable: true,
    description: '알림이 생성된 게시글 정보',
  })
  board?: Board;

  @ManyToOne(() => UsedProduct, { cascade: true, nullable: true })
  @JoinColumn()
  @Field(() => UsedProduct, {
    nullable: true,
    description: '알림이 생성된 중고 상품 정보',
  })
  product?: UsedProduct;

  @Column()
  @Field(() => String, { description: '알림 코드(코드표 참조)' })
  code: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date, { description: '알림 생성일' })
  create_at: Date;
}
