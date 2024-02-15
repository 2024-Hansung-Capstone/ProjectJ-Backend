import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { gqlAccessGuard, gqlAuthRefreshGuard } from './guards/gql-auth.guard';
import {
  IContext,
  IUserServiceUpdate,
} from './interfaces/user-service.interface';
import { UpdateUserInput } from './dto/update-user-input';

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

  //회원 정보 수정
  @UseGuards(gqlAccessGuard)
  @Mutation(() => User)
  async updateLoginUserInfo(
    @Context() Context: IContext,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    const result = await this.userService.update(Context.req.user.id, {
      updateUserInput,
    });
    //회원 정보 수정 실패
    if (!result) {
      throw new BadRequestException(
        '알 수 없는 이유로 사용자 정보 수정에 실패하였습니다.',
      );
    }
    //회원 정보 수정 성공
    return result;
  }

  //회원 정보 삭제
  @UseGuards(gqlAccessGuard)
  @Mutation(() => Boolean)
  async deleteLoginUser(@Context() context: IContext) {
    return await this.userService.delete(context.req.user.id);
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

  //로그인
  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: IContext,
  ): Promise<string> {
    const user = await this.userService.findByEmail(email); //이메일 기준으로 사용자 찾기
    //이메일을 통해 DB로부터 찾아진 유저가 없을 때
    if (!user) {
      throw new UnprocessableEntityException(
        '해당 이메일을 가진 사용자가 존재하지 않습니다.',
      );
    }
    //유저가 입력한 비밀번호와 해쉬된 비밀번호 비교(기본값이 false)
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) {
      throw new UnprocessableEntityException('비밀번호가 틀렸습니다.');
    }
    //에러가 모두 나지 않았을 경우
    this.userService.getRefreshToken(user, context); //refreshToken 생성
    return this.userService.getAccessToken(user);
  }

  //현재 로그인 되어있는 사용자의 정보를 가져오는 함수(JWT)
  @UseGuards(gqlAccessGuard)
  @Query(() => User)
  async whoAmI(@Context() context: IContext) {
    return await this.userService.findById(context.req.user.id);
  }

  //accessToken이 만료되었을 때, refreshToken이 있다면 새 accessToken을 발급해주는 함수
  @UseGuards(gqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(@Context() context: IContext): string {
    return this.userService.getRestoreToken({ id: context.req.user.id });
  }
}
