import { Field, Int, ObjectType, Float } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
@ObjectType()
export class Cooking_ingredient {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user_id: User;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ default: 0 })
  @Field(() => Int)
  count: number;

  @Column({ type: 'double precision', default: 0 })
  @Field(() => Float)
  volume: number;

  @Column({ type: 'double precision', default: 0 })
  @Field(() => Float)
  volume_unit: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  create_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  updated_at: Date;
}
