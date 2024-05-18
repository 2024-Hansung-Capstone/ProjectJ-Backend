import { Field, InputType, Int } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType({ description: '중고마켓 상품 수정 입력 정보' })
export class UpdateUsedProductInput {
  @Field(() => String, { description: '중고마켓 상품 ID' })
  id: string;

  @Field(() => String, { nullable: true, description: '상품 제목' })
  title?: string;

  @Field(() => Int, { nullable: true, description: '상품 가격' })
  price?: number;

  @Field(() => String, { nullable: true, description: '상품 설명' })
  detail?: string;

  @Field(() => String, { nullable: true, description: '상품 카테고리' })
  category?: string;

  @Field(() => String, {
    nullable: true,
    description: '상품 거래 상태(판매중/예약중/판매완료)',
  })
  state?: string;

  @Field(() => [GraphQLUpload], {
    nullable: true,
    description: '중고상품 이미지',
  })
  post_images?: FileUpload[];
}
