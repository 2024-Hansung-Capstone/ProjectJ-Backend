import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddViewProductInput {
  @Field(() => String)
  id: string;
}
