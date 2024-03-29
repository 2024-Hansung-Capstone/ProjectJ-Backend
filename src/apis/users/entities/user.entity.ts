//Entity: ERD 내에서 정의되어 있는 테이블대로 column을 정의한 클래스,
//추가적으로 데이터베이스를 사용하기 위해 typeorm과 graphql 관련 설정도 해줘야 함.

import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm'; //typeorm: 데이터베이스 관련
import { LikeUserRecord } from 'src/apis/like/entities/like_user_record.entity';
import { Dong } from 'src/apis/area/entities/dong.entity';
@Entity() //@ 들어간거 다 decorator  |  Entity: typeorm
@ObjectType() //graphql
export class User {
  //export: 외부에서도 이 클래스를 사용할 수 있게 해줌
  @PrimaryGeneratedColumn('uuid') //기본키, 자동으로 만들어주는 기능(원래는 @PrimaryColumn)
  @Field(() => String) //graphql, graphql은 괄호 안에 type을 지정해줘야함
  id: string;

  @OneToOne(() => Dong)
  @JoinColumn()
  @Field(() => Dong)
  dong: Dong;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  gender: string;

  @Column({ type: 'timestamp' }) //Date 타입은 이런 식으로 하면 돼요
  @Field(() => Date)
  birth_at: Date;

  @Column()
  @Field(() => String)
  mbti: string;

  @Column()
  @Field(() => String)
  phone_number: string;

  @Column()
  password: string;

  @Column({ default: false })
  @Field(() => Boolean)
  is_find_mate: boolean;

  @Column({ default: 0 })
  @Field(() => Int)
  point: number;

  @CreateDateColumn({ type: 'timestamp' }) // 기본값으로 현재시간을 가져오려면 이렇게 하면 됩니다
  @Field(() => Date)
  create_at: Date;

  @OneToMany(() => LikeUserRecord, (Like_user_record) => Like_user_record.user)
  like_user: LikeUserRecord[];
}
