import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/boards/entities/board.entity';
import { Letter } from 'src/apis/letters/entities/letter.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn()
  @Field(() => User)
  user: User;

  @ManyToOne(() => Letter, { cascade: true, nullable: true })
  @JoinColumn()
  @Field(() => Letter, { nullable: true })
  letter?: Letter;

  @ManyToOne(() => Board, { cascade: true, nullable: true })
  @JoinColumn()
  @Field(() => Board, { nullable: true })
  board?: Board;

  @Column()
  @Field(() => String)
  text: string;
}
