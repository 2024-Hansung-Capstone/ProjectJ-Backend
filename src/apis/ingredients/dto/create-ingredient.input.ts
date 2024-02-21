import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateIngredientInput {
  @Field(() => String)
  name: string;

  @Field(() => Int, { nullable: true })
  count?: number;

  @Field(() => Float, { nullable: true })
  volume?: number;

  @Field(() => String, { nullable: true })
  volume_unit?: string;
}
