import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { BoardService } from './boards.service';
import { Board } from './entities/board.entity';
import { UpdateBoardDto } from './dto/update-board.input';
import { SearchBoardDto } from './dto/search_board.input';
import { CreateBoardDto } from './dto/create-board.input';
import { IContext } from '../users/interfaces/user-service.interface';
import { UseGuards } from '@nestjs/common';
import { gqlAccessGuard } from '../users/guards/gql-auth.guard';
@Resolver('Board')
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {}

  @Query(() => [Board])
  async fetchBoards(@Args('category') category: string): Promise<Board[]> {
    return this.boardService.findAll(category);
  }

  @Query(() => Board)
  async fetchUsedProductById(@Args('id') id: string): Promise<Board> {
    return this.boardService.findById(id);
  }

  @Query(() => [Board], {
    description:
      '입력된 user_id를 가진 사용자가 작성한 중고 물품의 정보를 확인합니다.',
  })
  async fetchUsedProductByUserId(
    @Args('user_id') user_id: string,
  ): Promise<Board[]> {
    return await this.boardService.findByuser_Id(user_id);
  }

  @Query(() => [Board], {
    description:
      '종합검색 기능으로 가격은 검색한 가격보다 낮게 제목과 본문내용은 해당되는 내용이 있으면 검색이 되도록 설계',
  })
  async getPosts(
    @Args('SerachUsedProductInput') searchBoardInput: SearchBoardDto,
  ): Promise<Board[]> {
    return this.boardService.findBySerach(searchBoardInput);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board)
  async createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardDto,
    @Context() context: IContext,
  ): Promise<Board> {
    return this.boardService.create(context.req.user.id, createBoardInput);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board)
  async updateBoard(
    @Args('updateBoradInput') updateBoradInput: UpdateBoardDto,
    @Context() context: IContext,
  ): Promise<Board> {
    return this.boardService.update(context.req.user.id, updateBoradInput);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Boolean, {
    description:
      '입력된 id값을 가진 중고물품을 삭제합니다. (게시글의 유저정보와 로그인 된 유저가 동일해야지만 삭제 가능)',
  })
  async deleteUsedProduct(
    @Args('id') id: string,
    @Context() context: IContext,
  ): Promise<boolean> {
    return await this.boardService.delete(context.req.user.id, id);
  }

  @Mutation(() => Board, {
    description: '게시글의 조회수를 1 증가시킵니다.',
  })
  addViewToPost(@Args('id') id: string): Promise<Board> {
    return this.boardService.addViewToPost(id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board, {
    description:
      '게시글의 찜 수(Like)를 올려주고 Like_user_record에 찜한 회원과 중고물품을 저장',
  })
  addLikeTopost(
    @Args('id') id: string,
    @Context() context: IContext,
  ): Promise<Board> {
    return this.boardService.addLikeToPost(context.req.user.id, id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board, {
    description: '게시글의 찜을 취소하는 기능 찜한 게시글에게만 동작',
  })
  removeLikeTopost(
    @Args('id') id: string,
    @Context() context: IContext,
  ): Promise<Board> {
    return this.boardService.removeLikeToPost(context.req.user.id, id);
  }
}
