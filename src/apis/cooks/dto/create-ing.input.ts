import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateIngInput {
  @Field()
  name: string;

  @Field(() => Int, { nullable: true })
  count?: number;

  @Field(() => Float, { nullable: true })
  volume?: number;

  @Field({ nullable: true })
  volume_unit?: string;
}
