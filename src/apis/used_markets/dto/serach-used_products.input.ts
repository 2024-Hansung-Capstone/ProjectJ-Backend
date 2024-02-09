import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class Serach_ProductInput {
  @Field(() => String)
  title: string;

  @Field(() => Int)
  price: number;

  @Field(() => String)
  detail: string;

  @Field(() => String)
  category: string;

  @Field(() => String)
  state: string;
}
