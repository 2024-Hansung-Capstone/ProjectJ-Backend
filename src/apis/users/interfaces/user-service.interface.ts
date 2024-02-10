import { Request, Response } from 'express';
import { CreateUserInput } from '../dto/create-user.input';

export interface IUserServiceCreate {
  //인터페이스 이름 앞에는 무조건 I를 붙힘.
  createUserInput: CreateUserInput;
}

//strategy에서 인증이 되었을 때, return한 값을 request를 통해 받기 위해서 생성
export interface IContext {
  req: Request & IUserContext;
  res: Response;
}

//IContext의 request 안에서 user와 그 안의 id를 다른 코드에서 찾을 수 있도록 인터페이스를 생성
export interface IUserContext {
  user: {
    id: string;
  };
}
