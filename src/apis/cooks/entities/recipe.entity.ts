import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Ing {
  @Field(() => String)
  name: string;

  @Field(() => Int, { nullable: true })
  count?: number;

  @Field(() => Float, { nullable: true })
  volume?: number;

  @Field(() => String, { nullable: true })
  volume_unit?: string;
}

@ObjectType()
export class Recipe {
  @Field(() => String)
  name: string;

  @Field(() => [Ing], { nullable: true })
  used_ingredients?: Ing[];

  @Field(() => [Ing], { nullable: true })
  needed_ingredients?: Ing[];

  @Field(() => [String])
  instructions: string[];
}
