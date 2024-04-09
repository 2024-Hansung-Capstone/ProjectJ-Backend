import { Field, InputType, Int } from '@nestjs/graphql';

@InputType({ description: '중고마켓 상품 검색 입력 정보' })
export class SearchProductInput {
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
}
