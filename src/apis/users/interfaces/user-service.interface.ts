import { Request, Response } from 'express';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';

export interface IUserServiceCreate {
  createUserInput: CreateUserInput;
}

export interface IUserServiceUpdate {
  updateUserInput: UpdateUserInput;
}

export interface IContext {
  req: Request & IUserContext;
  res: Response;
}

export interface IUserContext {
  user: {
    id: string;
  };
}
