import { Field, Int, ObjectType, Float } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
@ObjectType({ description: '재료 정보' })
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: '고유 ID' })
  id: string;

  @Field(() => User, { description: '사용자 정보' })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  @Field(() => String, { description: '재료 이름' })
  name: string;

  @Column({ type: 'double precision', nullable: true })
  @Field(() => Float, { description: '재료 양' })
  volume: number;

  @Column({ nullable: true })
  @Field(() => String, { description: '재료 양 단위' })
  volume_unit: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date, { description: '추가일' })
  create_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Field(() => Date, { description: '수정일' })
  updated_at: Date;
}
