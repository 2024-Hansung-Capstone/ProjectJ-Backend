import { Field, InputType, Int, Float } from '@nestjs/graphql';

@InputType()
export class SearchOneRoomInput {
  @Field(() => String, { nullable: true })
  jibun?: string;

  @Field(() => Int, { nullable: true })
  maxmonthly_rent?: number;

  @Field(() => Int, { nullable: true })
  minmonthly_rent?: number;

  @Field(() => Int, { nullable: true })
  maxarea_exclusiveUse?: number;

  @Field(() => Int, { nullable: true })
  minarea_exclusiveUse?: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  dong?: string;

  @Field(() => Boolean, { nullable: true })
  is_monthly_rent?: boolean;

  @Field(() => Int, { nullable: true })
  maxdeposit?: number;

  @Field(() => Float, { nullable: true })
  mindeposit?: number;
}
