import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SearchProductInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Int, { nullable: true })
  price?: number;

  @Field(() => String, { nullable: true })
  detail?: string;

  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => String, { nullable: true })
  state?: string;
}
