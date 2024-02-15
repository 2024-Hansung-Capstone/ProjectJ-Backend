import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  user_id: string;

  @Column()
  @Field(() => String)
  letter_id: string;

  @Column()
  @Field(() => String)
  board_id: string;

  @Column()
  @Field(() => String)
  text: string;
}
