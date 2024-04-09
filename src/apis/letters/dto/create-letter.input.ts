import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: '쪽지 생성 입력 정보' })
export class CreateLetterInput {
  @Field(() => String, {
    description: '쪽지 카테고리(중고마켓, 자취생메이트, 룸메이트)',
  })
  category: string;

  @Field(() => String, { description: '쪽지 제목' })
  title: string;

  @Field(() => String, { description: '쪽지 내용' })
  detail: string;
}
