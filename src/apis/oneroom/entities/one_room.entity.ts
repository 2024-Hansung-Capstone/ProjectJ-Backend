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
@ObjectType()
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
