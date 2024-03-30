import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ReplyLetterInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  detail: string;
}
