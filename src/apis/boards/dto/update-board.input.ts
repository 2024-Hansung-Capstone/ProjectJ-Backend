import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateBoardDto {
  @Field(() => String)
  id: string;

  @Field(() => Date)
  createat?: Date;

  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  detail?: string;
}
