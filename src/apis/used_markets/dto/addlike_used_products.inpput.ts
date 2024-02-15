import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddLikeProductInput {
  @Field(() => String)
  id: string;
}
