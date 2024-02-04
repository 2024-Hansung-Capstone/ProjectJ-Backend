import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Sido {
  @PrimaryColumn('varchar', { length: 2 })
  @Field(() => String)
  id: string;

  @Column({ length: 50 })
  @Field(() => String)
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  crtr_at: Date;
}
