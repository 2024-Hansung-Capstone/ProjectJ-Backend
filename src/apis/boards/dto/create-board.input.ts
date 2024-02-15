import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBoardDto {
  @Field(() => String)
  category: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  detail: string;
}

@InputType()
export class UpdateBoardDto {
  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  detail?: string;
}