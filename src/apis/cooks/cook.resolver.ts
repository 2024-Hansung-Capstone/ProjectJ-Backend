import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CookService } from './cook.service';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { gqlAccessGuard } from '../users/guards/gql-auth.guard';
import { Cook } from './entities/cook.entity';
import { IContext } from '../users/interfaces/user-service.interface';
import { CreateCookInput } from './dto/create-cook.input';
import { UpdateCookInput } from './dto/update-cook.input';

@Resolver()
export class CookResolver {
  constructor(private readonly cookService: CookService) {}

  //요리 게시글 작성
  @UseGuards(gqlAccessGuard)
  @Mutation(() => Cook)
  async createCook(
    @Context() context: IContext,
    @Args('createCookInput')
    createCookInput: CreateCookInput,
  ) {
    return await this.cookService.create(context.req.user.id, createCookInput);
  }

  @Query(() => [Cook])
  async fetchCookByUserId(@Args('user_id') user_id: string): Promise<Cook> {
    return this.cookService.findByUserId(user_id);
  }

  //수정
  @Mutation(() => Cook)
  async updateCook(
    @Args('cook_id') cook_id: string,
    @Args('updateCookInput') updateCookInput: UpdateCookInput,
  ): Promise<Cook> {
    const result = await this.cookService.update(cook_id, updateCookInput);
    if (!result) {
      throw new BadRequestException(
        '알 수 없는 이유로 게시글 수정에 실패하였습니다.',
      );
    }
    return result;
  }

  //삭제
  @Mutation(() => Boolean)
  async deleteCook(@Args('cook_id') cook_id: string): Promise<boolean> {
    return await this.cookService.delete(cook_id);
  }

  //조회수 증가
  @Query(() => Cook)
  async increaseCookView(@Args('id') id: string): Promise<Cook> {
    return await this.cookService.increaseView(id);
  }

  //조회수로 순위 생성
  async fetchCookByViewRank(
    @Args('rank') rank: number,
  ): Promise<Cook[]> {
    return this.cookService.findTopCooks(rank);
  }

  //검색 기능
  @Query(() => [Cook])
  async searchCook(@Args('keyword') keyword: string): Promise<Cook[]> {
    return this.cookService.search(keyword);
  }
}
