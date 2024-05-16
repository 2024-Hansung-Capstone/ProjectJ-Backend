import { Field, InputType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType({ description: '게시글 수정 입력 정보' })
export class UpdateBoardInput {
  @Field(() => String, { description: '고유 ID' })
  id: string;

  @Field(() => String, { nullable: true, description: '게시판 카테고리' })
  category?: string;

  @Field(() => String, { nullable: true, description: '게시글 제목' })
  title?: string;

  @Field(() => String, { nullable: true, description: '게시글 내용' })
  detail?: string;

  @Field(() => [GraphQLUpload], { nullable: true, description: '게시글 이미지' })
  post_images?: FileUpload[];
}
