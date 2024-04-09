import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Sgng } from './sgng.entity';

@Entity()
@ObjectType({ description: '행정동 정보' })
export class Dong {
  @PrimaryColumn('varchar', { length: 10 })
  @Field(() => String, { description: '행정동 코드' })
  id: string;

  @ManyToOne(() => Sgng)
  @Field(() => Sgng, { description: '시/군/구 정보' })
  sgng: Sgng;

  @Column({ length: 50 })
  @Field(() => String, { description: '행정동 이름' })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date, { description: '기준일자' })
  crtr_at: Date;
}
