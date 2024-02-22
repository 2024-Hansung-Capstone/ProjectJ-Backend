import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UsedProduct } from './used_product.entity';
import { Board } from 'src/apis/boards/entities/board.entity';
import { Reply } from 'src/apis/boards/entities/reply.entity';
@Entity()
@ObjectType()
export class Like_user_record {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User, (users) => users.like_user)
  @JoinColumn()
  user: User;

  @ManyToOne(() => UsedProduct, (Used_products) => Used_products.Like_users, {
    nullable: true,
  })
  @JoinColumn()
  used_product: UsedProduct | null;

  @ManyToOne(() => Board, (Board) => Board.likeUsers, {
    nullable: true,
  })
  @JoinColumn()
  board: Board | null;

  @ManyToOne(() => Reply, (Reply) => Reply.likeUsers, {
    nullable: true,
  })
  @JoinColumn()
  Reply: Reply | null;
}
