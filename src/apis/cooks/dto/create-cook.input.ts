import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCookInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  detail: string;
}
