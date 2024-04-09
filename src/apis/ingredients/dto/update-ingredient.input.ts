import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType({ description: '식재료 수정 입력 정보' })
export class UpdateIngredientInput {
  @Field(() => String, { description: '고유 ID' })
  id: string;

  @Field(() => String, { nullable: true, description: '식재료 이름' })
  name?: string;

  @Field(() => Int, { nullable: true, description: '식재료 수량' })
  count?: number;

  @Field(() => Float, { nullable: true, description: '식재료 양' })
  volume?: number;

  @Field(() => String, { nullable: true, description: '식재료 양 단위' })
  volume_unit?: string;
}
