import { Field, ObjectType, Int } from '@nestjs/graphql';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
@Entity()
@ObjectType()
export class Point {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: '고유 ID' })
  id: string;

  @Column({ default: 0 })
  @Field(() => Int, { description: '포인트 값' })
  value: number;

  @Column({ length: 50, default: '자취어린이' })
  @Field(() => String, { description: '포인트 값에 따른 호칭' })
  title: string;

  @Column('simple-array', { nullable: true })
  @Field(() => [Date], { nullable: true, description: '출석한 날짜' })
  attendanceDates: Date[];
}
