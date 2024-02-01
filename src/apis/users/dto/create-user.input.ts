import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  gender: string;

  @Field(() => String)
  birth_year: string;

  @Field(() => String)
  birth_month: string;

  @Field(() => String)
  birth_day: string;

  @Field(() => String)
  mbti: string;

  @Field(() => String)
  phone_number: string;

  @Field(() => String)
  password: string;

  @Field(() => Boolean)
  is_find_mate: boolean;
}
