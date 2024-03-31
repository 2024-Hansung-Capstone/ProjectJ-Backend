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

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true }) // 15자리 정밀도와 소수점 4자리까지 허용
  @Field(() => Float, { nullable: true }) // GraphQL 스키마에서 타입 지정
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

  @Column({ type: 'decimal', precision: 15, scale: 3, nullable: true }) // 15자리 정밀도와 소수점 2자리까지 허용
  @Field(() => Float, { nullable: true }) // GraphQL 스키마에서 타입 지정
  deposit: number | null;
}
