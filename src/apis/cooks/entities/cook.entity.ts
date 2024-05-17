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
  @Field(() => String)
  id: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user: User;

  @JoinColumn()
  @OneToMany(() => PostImage, (postImage) => postImage.cook, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [PostImage])
  post_images: PostImage[];

  @Column({ length: 100 })
  @Field(() => String)
  name: string;

  @Column({ type: 'text' })
  @Field(() => String)
  detail: string;

  @Column({ default: 0 })
  @Field(() => Int)
  view: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  create_at: Date;
}
