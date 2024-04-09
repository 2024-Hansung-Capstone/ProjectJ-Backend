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
import { IContext } from './interfaces/user-service.interface';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User, {
    description:
      '신규 회원 가입 기능입니다. (이메일 중복이 없고 휴대폰 인증이 완료되어야 가능)',
  })
  async signUp(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return await this.userService.create({ createUserInput });
  }

  @Query(() => [User], { description: '전체 사용자 정보 조회 기능입니다.' })
  async fetchUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Query(() => User, {
    description: '특정 사용자 id값을 기준으로 사용자 정보 조회 기능입니다.',
  })
  async fetchUserById(@Args('user_id') user_id: string): Promise<User> {
    return await this.userService.findById(user_id);
  }

  @UseGuards(gqlAccessGuard)
  @Query(() => User, {
    description: '현재 로그인된 사용자 정보를 조회하는 기능입니다.',
  })
  async whoAmI(@Context() context: IContext) {
    return await this.userService.findById(context.req.user.id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => User, {
    description: '현재 로그인 된 사용자의 정보를 수정하는 기능입니다.',
  })
  async updateUser(
    @Context() context: IContext,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    const result = await this.userService.update(context.req.user.id, {
      updateUserInput,
    });
    if (!result) {
      throw new BadRequestException(
        '알 수 없는 이유로 사용자 정보 수정에 실패하였습니다.',
      );
    }
    return result;
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Boolean, {
    description: '현재 로그인 된 사용자의 탈퇴 기능입니다.',
  })
  async deleteUser(@Context() context: IContext) {
    return await this.userService.delete(context.req.user.id);
  }

  @Mutation(() => String, {
    description: '휴대폰 인증을 위해 인증번호를 생성하는 기능입니다.',
  })
  async createToken(
    @Args('phone_number') phone_number: string,
  ): Promise<string> {
    return await this.userService.createToken(phone_number);
  }

  @Mutation(() => Boolean, {
    description: '인증 토큰을 통해 휴대폰 인증을 진행하는 기능입니다.',
  })
  async authPhone(
    @Args('phone_number') phone_number: string,
    @Args('token') token: string,
  ): Promise<boolean> {
    return await this.userService.checkToken(phone_number, token);
  }

  @Mutation(() => String, {
    description:
      '로그인을 하는 기능입니다. (JWT 토큰을 return하여 발급, cookie에 재발급용 JWT 토큰 발급)',
  })
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: IContext,
  ): Promise<string> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnprocessableEntityException(
        '해당 이메일을 가진 사용자가 존재하지 않습니다.',
      );
    }

    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) {
      throw new UnprocessableEntityException('비밀번호가 틀렸습니다.');
    }

    this.userService.getRefreshToken(user, context);
    return this.userService.getAccessToken(user);
  }

  @Mutation(() => Boolean, {
    description: '로그아웃 기능입니다. (재발급용 JWT 토큰을 삭제)',
  })
  logout(@Context() context: IContext): boolean {
    try {
      context.res.setHeader('Set-Cookie', [
        'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure;',
      ]);
      return true;
    } catch (error) {
      return false;
    }
  }

  @UseGuards(gqlAuthRefreshGuard)
  @Mutation(() => String, {
    description:
      'JWT 토큰이 만료되었을 때 cookie에 저장된 토큰으로 로그인 토큰을 재발급하는 기능입니다.',
  })
  restoreAccessToken(@Context() context: IContext): string {
    return this.userService.getRestoreToken({ id: context.req.user.id });
  }

  @Mutation(() => String, {
    description:
      '!!테스트용!! 인증번호 전송 없이 바로 토큰 생성과 인증이 완료되는 테스트용 기능입니다.',
  })
  async testCreateToken(
    @Args('phone_number') phone_number: string,
  ): Promise<string> {
    return await this.userService.createTestToken(phone_number);
  }
}
