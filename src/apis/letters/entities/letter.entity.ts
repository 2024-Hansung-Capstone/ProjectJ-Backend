import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Letter {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  sender_id: string;

  @Column()
  @Field(() => String)
  reciever_id: string;

  @Column()
  @Field(() => String)
  product_id: string;

  @Column()
  @Field(() => String)
  board_id: string;

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
  is_read: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  create_at: Date;
}
