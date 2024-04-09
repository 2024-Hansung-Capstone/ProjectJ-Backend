import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Sido } from './sido.entity';

@Entity()
@ObjectType({ description: '시/군/구 정보' })
export class Sgng {
  @PrimaryColumn('varchar', { length: 5 })
  @Field(() => String, { description: '시/군/구 코드' })
  id: string;

  @ManyToOne(() => Sido)
  @Field(() => Sido, { description: '시/도 정보' })
  sido: Sido;

  @Column({ length: 50 })
  @Field(() => String, { description: '시/군/구 이름' })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date, { description: '기준일자' })
  crtr_at: Date;
}
