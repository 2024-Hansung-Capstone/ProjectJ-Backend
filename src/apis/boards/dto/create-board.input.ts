import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: '게시글 생성 입력 정보' })
export class CreateBoardInput {
  @Field(() => String, { description: '게시판 카테고리' })
  category: string;

  @Field(() => String, { description: '게시글 제목' })
  title: string;

  @Field(() => String, { description: '게시글 내용' })
  detail: string;
}
