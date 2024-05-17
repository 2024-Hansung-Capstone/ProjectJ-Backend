import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Ing {
  @Field(() => String, { description: '재료 이름' })
  name: string;

  @Field(() => Float, { description: '재료 양' })
  volume: number;

  @Field(() => String, { description: '재료 단위' })
  volume_unit: string;
}

@ObjectType()
export class Recipe {
  @Field(() => String, { description: '레시피 이름' })
  name: string;

  @Field(() => [Ing], { nullable: true, description: '사용한 재료' })
  used_ingredients?: Ing[];

  @Field(() => [Ing], { nullable: true, description: '필요한 재료' })
  needed_ingredients?: Ing[];

  @Field(() => [String], { nullable: true, description: '조리 방법' })
  instructions: string[];
}
