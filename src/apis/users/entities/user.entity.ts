import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { LikeUserRecord } from 'src/apis/like/entities/like_user_record.entity';
import { Dong } from 'src/apis/area/entities/dong.entity';
import { PostImage } from 'src/apis/post_image/entities/postImage.entity';

@Entity()
@ObjectType({ description: '사용자 정보' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: '고유 ID' })
  id: string;

  @JoinColumn()
  @OneToOne(() => PostImage, (PostImage) => PostImage.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Field(() => PostImage, {
    description: '사용자 프로필 이미지',
    nullable: true,
  })
  profile_image?: PostImage;

  @ManyToOne(() => Dong, { nullable: false })
  @JoinColumn()
  @Field(() => Dong, { description: '사용자 거주지역(행정동)' })
  dong: Dong;

  @Column()
  @Field(() => String, { description: '이메일' })
  email: string;

  @Column()
  @Field(() => String, { description: '성함' })
  name: string;

  @Column()
  @Field(() => String, { description: '성별' })
  gender: string;

  @Column({ type: 'timestamp' })
  @Field(() => Date, { description: '생년월일' })
  birth_at: Date;

  @Column()
  @Field(() => String, { description: 'MBTI' })
  mbti: string;

  @Column()
  @Field(() => String, { description: '휴대폰 번호 ex)01012345678' })
  phone_number: string;

  @Column()
  password: string;

  @Column({ default: false })
  @Field(() => Boolean, { description: '메이트 매칭 여부' })
  is_find_mate: boolean;

  @Column({ default: 0 })
  @Field(() => Int, { description: '포인트' })
  point: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date, { description: '가입일' })
  create_at: Date;

  @OneToMany(() => LikeUserRecord, (LikeUserRecord) => LikeUserRecord.user)
  like_user: LikeUserRecord[];
}
