import { Field, InputType } from '@nestjs/graphql';
import { CreateIngInput } from './create-ing.input';
import { Ing } from '../entities/recipe.entity';

@InputType()
export class UpdateCookInput {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  detail: string;

  @Field(() => [CreateIngInput], { nullable: true })
  ingredients: Ing[];

  @Field(() => [String], { nullable: true })
  instructions: string[];
}
