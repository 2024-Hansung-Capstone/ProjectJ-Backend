import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateUsedProductStateInput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  state: string;
}
