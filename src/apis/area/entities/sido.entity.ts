import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
@ObjectType({ description: '시/도 정보' })
export class Sido {
  @PrimaryColumn('varchar', { length: 2 })
  @Field(() => String, { description: '시/도 코드' })
  id: string;

  @Column({ length: 50 })
  @Field(() => String, { description: '시/도 이름' })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date, { description: '기준일자' })
  crtr_at: Date;
}
