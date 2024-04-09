import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UsedProduct } from '../../used_markets/entities/used_product.entity';
import { Board } from 'src/apis/boards/entities/board.entity';
import { Reply } from 'src/apis/boards/entities/reply.entity';
@Entity()
@ObjectType({ description: '좋아요 기록 정보' })
export class LikeUserRecord {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: '고유 ID' })
  id: string;

  @ManyToOne(() => User, (users) => users.like_user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Field(() => User, { description: '좋아요 누른 사용자 정보' })
  user: User;

  @ManyToOne(() => UsedProduct, (Used_products) => Used_products.like_user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Field(() => UsedProduct, {
    nullable: true,
    description: '좋아요 누른 중고 상품 정보',
  })
  used_product: UsedProduct;

  @ManyToOne(() => Board, (Board) => Board.like_user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Field(() => Board, {
    nullable: true,
    description: '좋아요 누른 게시글 정보',
  })
  board: Board;

  @ManyToOne(() => Reply, (Reply) => Reply.like_user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Field(() => Reply, { nullable: true, description: '좋아요 누른 댓글 정보' })
  reply: Reply;
}
