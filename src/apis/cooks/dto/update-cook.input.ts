import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCookInput {
  @Field(() => String, { nullable: true })
  name?: string;

  // @Field(() => [Ing], { nullable: true })
  // ingredients?: Ing[];
}
