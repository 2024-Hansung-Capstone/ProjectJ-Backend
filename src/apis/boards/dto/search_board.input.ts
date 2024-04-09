import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: '게시글 검색 입력 정보' })
export class SearchBoardInput {
  @Field(() => String, { nullable: true, description: '게시판 카테고리' })
  category?: string;

  @Field(() => String, { nullable: true, description: '게시글 제목' })
  title?: string;

  @Field(() => String, { nullable: true, description: '게시글 내용' })
  detail?: string;
}
