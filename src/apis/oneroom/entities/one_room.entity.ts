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

  @Column({ length: 50, default: '' })
  @Field(() => String)
  jibun: string;

  @Column({ nullable: true })
  @Field(() => Int)
  monthly_rent: number | null;

  @Column({ nullable: true })
  @Field(() => Int)
  area_exclusiveUse: number | null;

  @Column({ length: 50, default: '' })
  @Field(() => String)
  name: string;

  @Column({ length: 50, default: '' })
  @Field(() => String)
  dong: string;
}
