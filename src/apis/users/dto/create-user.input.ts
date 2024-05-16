import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: '유저 생성 입력 정보',
})
export class CreateUserInput {
  @Field(() => String, { description: '이메일' })
  email: string;

  @Field(() => String, { description: '성함' })
  name: string;

  @Field(() => String, { description: '성별' })
  gender: string;

  @Field(() => String, { description: '생년' })
  birth_year: string;

  @Field(() => String, { description: '생월' })
  birth_month: string;

  @Field(() => String, { description: '생일' })
  birth_day: string;

  @Field(() => String, { description: 'MBTI' })
  mbti: string;

  @Field(() => String, { description: '행정동 지역코드' })
  dong_code: string;

  @Field(() => String, { description: '휴대폰 번호 ex)01012345678' })
  phone_number: string;

  @Field(() => String, { description: '비밀번호' })
  password: string;

  @Field(() => Boolean, { description: '메이트 매칭 여부' })
  is_find_mate: boolean;
}
