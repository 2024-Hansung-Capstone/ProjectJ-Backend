import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: '쪽지 답장 입력 정보' })
export class ReplyLetterInput {
  @Field(() => String, { description: '쪽지 답장 제목' })
  title: string;

  @Field(() => String, { description: '쪽지 답장 내용' })
  detail: string;
}
