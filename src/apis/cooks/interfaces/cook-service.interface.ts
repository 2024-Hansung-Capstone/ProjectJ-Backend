import { CreateCookInput } from '../dto/create-cook.input';

export interface ICookServiceCreate {
  createCookInput: CreateCookInput;
}
export interface ICookServiceUpdate {
  updateCookInput: UpdateCookInput;
}
