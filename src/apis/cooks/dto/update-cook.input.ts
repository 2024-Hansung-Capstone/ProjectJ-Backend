import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCookInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  detail?: string;
}
