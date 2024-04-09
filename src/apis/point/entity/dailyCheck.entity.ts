import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
@ObjectType({ description: '출석 정보' })
export class DailyCheck {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: '고유 ID' })
  id: string;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn()
  @Field(() => User, { description: '출석한 사용자 정보' })
  user: User;

  @Column()
  @Field(() => Date, { nullable: true, description: '출석한 날짜' })
  checked_at: Date;
}
