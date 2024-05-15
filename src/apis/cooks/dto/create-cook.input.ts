import { Field, InputType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class CreateCookInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  detail: string;

  @Field(() => [GraphQLUpload])
  post_images: FileUpload[]
}
