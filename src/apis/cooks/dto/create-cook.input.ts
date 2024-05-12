import { Field, InputType } from '@nestjs/graphql';
import { Ing } from '../entities/recipe.entity';

@InputType()
export class CreateCookInput {
  @Field(() => String)
  name: string;

  // @Field(() => [Ing])
  // ingredients: Ing[];
}
