import { Field, InputType } from '@nestjs/graphql';
import { Ing } from '../entities/recipe.entity';
import { CreateIngInput } from './create-ing.input';

@InputType()
export class CreateCookInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  detail: string;

  @Field(() => [CreateIngInput])
  ingredients: Ing[];

  @Field(() => [String])
  instructions: string[];
}
