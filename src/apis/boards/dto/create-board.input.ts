import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBoardDto {
  @Field(() => String)
  category: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  detail: string;
}
