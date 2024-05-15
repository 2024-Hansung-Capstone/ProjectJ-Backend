import { Field, InputType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class UpdateCookInput {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  detail: string;

  @Field(() => [GraphQLUpload], { nullable: true })
  post_images: FileUpload[]
}
