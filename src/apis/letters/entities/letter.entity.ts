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
@ObjectType()
export class Letter {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => User)
  sender: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => User)
  receiver: User;

  @ManyToOne(() => UsedProduct, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn()
  @Field(() => UsedProduct, { nullable: true })
  product?: UsedProduct;

  @ManyToOne(() => Board, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn()
  @Field(() => Board, { nullable: true })
  board?: Board;

  @Column()
  @Field(() => String)
  category: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  detail: string;

  @Column({ default: false })
  @Field(() => Boolean)
  is_read: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  create_at: Date;
}
