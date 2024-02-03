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
@ObjectType()
export class Dong {
  @PrimaryColumn('varchar', { length: 10 })
  @Field(() => String)
  id: string;

  @ManyToOne(() => Sgng)
  sgng_id: Sgng;

  @Column({ length: 50 })
  @Field(() => String)
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  crtr_at: Date;
}
