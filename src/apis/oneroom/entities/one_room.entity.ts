import { Field, Int, ObjectType, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  @Field(() => Float, { nullable: true })
  area_exclusiveUse: number | null;

  @Column({ length: 50, default: '' })
  @Field(() => String)
  name: string;

  @Column({ length: 50, default: '' })
  @Field(() => String)
  dong: string;

  @Column({ default: false })
  @Field(() => Boolean)
  is_monthly_rent: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 3, nullable: true })
  @Field(() => Float, { nullable: true })
  deposit: number | null;

  @Column({ default: 0 })
  @Field(() => Int)
  view: number;
}
