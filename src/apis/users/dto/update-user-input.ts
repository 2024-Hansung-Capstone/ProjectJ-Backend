import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  gender?: string;

  @Field(() => String, { nullable: true })
  birth_year?: string;

  @Field(() => String, { nullable: true })
  birth_month?: string;

  @Field(() => String, { nullable: true })
  birth_day?: string;

  @Field(() => String, { nullable: true })
  mbti?: string;

  @Field(() => Boolean, { nullable: true })
  is_find_mate?: boolean;
}
