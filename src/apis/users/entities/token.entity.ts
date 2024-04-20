import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@ObjectType({ description: '인증 토큰 정보' })
export class Token {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: '고유 ID' })
  id: string;

  @OneToOne(() => User, { nullable: true, onDelete: 'CASCADE', cascade: true })
  @JoinColumn()
  @Field(() => User, { nullable: true, description: '사용자 정보' })
  user: User;

  @Column()
  @Field(() => String, { description: '휴대폰 번호 ex)01012345678' })
  phone_number: string;

  @Column()
  @Field(() => String, { description: '인증번호' })
  token: string;

  @Column({ default: false })
  @Field(() => Boolean, { description: '인증 여부' })
  is_auth: boolean;
}
