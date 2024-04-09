import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Role {
  @PrimaryColumn({ unique: true })
  @Field(() => String, { description: '등급 코드' })
  code: string;

  @Column()
  @Field(() => Int, { description: '최소 포인트' })
  min_point: number;

  @Column()
  @Field(() => Int, { description: '최대 포인트' })
  max_point: number;

  @Column({ unique: true })
  @Field(() => String, { description: '등급 이름' })
  name: string;
}
