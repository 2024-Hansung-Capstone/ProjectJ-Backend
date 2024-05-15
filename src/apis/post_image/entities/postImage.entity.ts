import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/boards/entities/board.entity';
import { Cook } from 'src/apis/cooks/entities/cook.entity';
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

  @Column({ length: 255 })
  @Field(() => String, {
    description: '이미지경로(아마존S3에 저장되어 있는 파일 이름)',
  })
  imagePath: string;
  @ManyToOne(() => Board, (Board) => Board.post_images, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Field(() => Board, {
    nullable: true,
    description: '해당 이미지가 있는 게시글',
  })
  board: Board;

  @ManyToOne(() => UsedProduct, (UsedProduct) => UsedProduct.post_images, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Field(() => UsedProduct, {
    nullable: true,
    description: '해당 이미지가 있는 중고 상품 정보',
  })
  used_proudct: UsedProduct;

  @JoinColumn()
  @ManyToOne(() => Cook, (Cook) => Cook.post_images, {
    eager: false,
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  cook: Cook;
}
