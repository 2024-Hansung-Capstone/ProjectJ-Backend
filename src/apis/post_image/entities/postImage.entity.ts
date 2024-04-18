import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/boards/entities/board.entity';
import { UsedProduct } from 'src/apis/used_markets/entities/used_product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class PostImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: '고유 ID' })
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  imagePath: string;

  @JoinColumn()
  @ManyToOne(() => Board, (Board) => Board.post_image, {
    eager: false,
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  board: Board;

  @JoinColumn()
  @ManyToOne(() => UsedProduct, (UsedProduct) => UsedProduct.post_image, {
    eager: false,
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  used_proudct: UsedProduct;
}
