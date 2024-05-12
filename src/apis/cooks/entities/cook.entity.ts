import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ing } from './recipe.entity';

@Entity()
@ObjectType()
export class Cook {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ length: 100 })
  @Field(() => String)
  name: string;

  @Column({ default: 0 })
  @Field(() => Int)
  view: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  create_at: Date;
}
