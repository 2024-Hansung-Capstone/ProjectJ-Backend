import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  //Mutation: 추가, 삭제, 변경, 생성
  //Query: 조회
  @Mutation(() => User)
  async signUp(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    //함수의 return 타입을 지정해줌.
    return await this.userService.create({ createUserInput });
  }

  //전체 유저 조회
  @Query(() => [User]) //graphql에서 배열을 지정할 때는 단어의 좌우로 대괄호를 넣어줘야 함.
  async fetchUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  //특정 id를 갖고 있는 유저만 조회
  @Query(() => User)
  async fetchUserById(@Args('user_id') user_id: string): Promise<User> {
    return await this.userService.findById(user_id);
  }

  @Mutation(() => String)
  async makeToken(@Args('phone_number') phone_number: string): Promise<string> {
    return await this.userService.createToken(phone_number);
  }

  @Mutation(() => Boolean)
  async authPhone(
    @Args('phone_number') phone_number: string,
    @Args('token') token: string,
  ): Promise<boolean> {
    return await this.userService.checkToken(phone_number, token);
  }
}
