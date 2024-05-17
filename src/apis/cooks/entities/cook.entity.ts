import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostImage } from 'src/apis/post_image/entities/postImage.entity';

@Entity()
@ObjectType()
export class Cook {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: '요리 ID' })
  id: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @Field(() => User, { description: '작성자 정보' })
  user: User;

  @JoinColumn()
  @OneToMany(() => PostImage, (postImage) => postImage.cook, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [PostImage], { description: '요리 이미지' })
  post_images: PostImage[];

  @Column({ length: 100 })
  @Field(() => String, { description: '요리 이름' })
  name: string;

  @Column({ type: 'text' })
  @Field(() => String, { description: '요리 설명' })
  detail: string;

  @Column({ default: 0 })
  @Field(() => Int, { description: '조회수' })
  view: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date, { description: '작성일' })
  create_at: Date;
}
