import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
@ObjectType({ description: '중고거래 데이터 엔티티' })
export class OneRoom {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;
}
