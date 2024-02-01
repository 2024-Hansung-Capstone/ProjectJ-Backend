import { CreateUserInput } from '../dto/create-user.input';

export interface IUserServiceCreate {
  //인터페이스 이름 앞에는 무조건 I를 붙힘.
  createUserInput: CreateUserInput;
}
