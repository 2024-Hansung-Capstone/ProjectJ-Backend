import { CreateIngredientInput } from '../dto/create-ingredient.input';
import { UpdateIngredientInput } from '../dto/update-ingredient.input';

export interface IIngredientServiceCreate {
  createIngredientInput: CreateIngredientInput;
}

export interface IIngredientServiceUpdate {
  updateIngredientInput: UpdateIngredientInput;
}
