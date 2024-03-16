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

  @Column({ length: 50 })
  @Field(() => String)
  jibun: string;

  @Column({ default: 0 })
  @Field(() => Int)
  monthly_rent: number;

  @Column({ default: 0 })
  @Field(() => Int)
  area_exclusiveUse: number;

  @Column({ length: 50 })
  @Field(() => String)
  name: string;

  @Column({ length: 50 })
  @Field(() => String)
  dong: string;

  @Column({ default: 0 }) //y
  @Field(() => Int)
  latitude: number;

  @Column({ default: 0 }) //x
  @Field(() => Int)
  longitude: number;
}
