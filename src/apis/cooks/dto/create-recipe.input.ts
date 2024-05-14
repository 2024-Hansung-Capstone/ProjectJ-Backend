import { Field, InputType } from '@nestjs/graphql';
import { Ing } from '../entities/recipe.entity';
import { CreateIngInput } from './create-ing.input';

@InputType()
export class CreateRecipeInput {
  @Field(() => String)
  name: string;

  @Field(() => [CreateIngInput], { nullable: true })
  used_ingredients?: Ing[];

  @Field(() => [CreateIngInput], { nullable: true })
  needed_ingredients?: Ing[];

  @Field(() => [String])
  instructions: string[];
}
