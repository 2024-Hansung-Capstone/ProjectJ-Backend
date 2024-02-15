import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddViewProductsInput {
  @Field(() => String)
  id: string;
}
