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
  user: User;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  count?: number;

  @Column({ type: 'double precision', nullable: true })
  @Field(() => Float, { nullable: true })
  volume?: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  volume_unit?: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  create_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  updated_at: Date;
}
