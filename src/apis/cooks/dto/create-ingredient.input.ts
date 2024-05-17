import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType({ description: '식재료 생성 입력 정보' })
export class CreateIngredientInput {
  @Field(() => String, { description: '식재료 이름' })
  name: string;

  @Field(() => Float, { description: '식재료 양' })
  volume: number;

  @Field(() => String, { description: '식재료 양 단위' })
  volume_unit: string;
}
