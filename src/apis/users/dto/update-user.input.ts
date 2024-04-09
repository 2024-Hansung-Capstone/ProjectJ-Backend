import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: '유저 정보 수정 입력 정보',
})
export class UpdateUserInput {
  @Field(() => String, { nullable: true, description: '이메일' })
  email?: string;

  @Field(() => String, { nullable: true, description: '성함' })
  name?: string;

  @Field(() => String, { nullable: true, description: '성별' })
  gender?: string;

  @Field(() => String, { nullable: true, description: '생년' })
  birth_year?: string;

  @Field(() => String, { nullable: true, description: '생월' })
  birth_month?: string;

  @Field(() => String, { nullable: true, description: '생일' })
  birth_day?: string;

  @Field(() => String, { nullable: true, description: 'MBTI' })
  mbti?: string;

  @Field(() => Boolean, { nullable: true, description: '메이트 매칭 여부' })
  is_find_mate?: boolean;
}
