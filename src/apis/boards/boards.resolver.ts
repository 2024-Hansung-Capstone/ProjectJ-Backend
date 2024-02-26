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

  @Query(() => [Board], {
    description: '입력된 카테고리를 게시글의 정보를 확인합니다.',
  })
  async fetchBoards(@Args('category') category: string): Promise<Board[]> {
    return this.boardService.findAll(category);
  }

  @Query(() => Board)
  async fetchBoardById(@Args('id') id: string): Promise<Board> {
    return this.boardService.findById(id);
  }

  @Query(() => [Board], {
    description:
      '입력된 user_id를 가진 사용자가 작성한 게시글의 정보를 확인합니다.',
  })
  async fetchBoardByUserId(@Args('user_id') user_id: string): Promise<Board[]> {
    return await this.boardService.findByuser_Id(user_id);
  }

  @Query(() => [Board], {
    description:
      '종합검색 기능으로 제목과 본문내용은 해당되는 내용이 있으면 검색이 되도록 설계',
  })
  async fetchBoardsBySerach(
    @Args('SerachUsedProductInput') searchBoardInput: SearchBoardDto,
  ): Promise<Board[]> {
    return this.boardService.findBySerach(searchBoardInput);
  }

  @Query(() => [Board], {
    description: '조회수가 많은 게시글 5개를 리턴',
  })
  async fetchBoardsByView(
    @Args('category') category: string,
  ): Promise<Board[]> {
    return this.boardService.findByView(category);
  }
  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board, {
    description: '입력된 정보를 바탕으로 게시글을 작성합니다',
  })
  async createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardDto,
    @Context() context: IContext,
  ): Promise<Board> {
    return this.boardService.create(context.req.user.id, createBoardInput);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board, {
    description:
      '입력된 id값을 가진 게시글을 수정합니다. (게시글의 유저정보와 로그인 된 유저가 동일해야지만 수정 가능)',
  })
  async updateBoard(
    @Args('updateBoradInput') updateBoradInput: UpdateBoardDto,
    @Context() context: IContext,
  ): Promise<Board> {
    return this.boardService.update(context.req.user.id, updateBoradInput);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Boolean, {
    description:
      '입력된 id값을 가진 게시글을 삭제합니다. (게시글의 유저정보와 로그인 된 유저가 동일해야지만 삭제 가능)',
  })
  async deleteBoard(
    @Args('id') id: string,
    @Context() context: IContext,
  ): Promise<boolean> {
    return await this.boardService.delete(context.req.user.id, id);
  }

  @Mutation(() => Board, {
    description: '게시글의 조회수를 1 증가시킵니다.',
  })
  addViewToBoard(@Args('id') id: string): Promise<Board> {
    return this.boardService.addViewToBoard(id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board, {
    description:
      '게시글의  좋아요수(Like)를 올려주고 Like_user_record에 좋아요한 회원과 게시글을 저장',
  })
  addLikeToBoard(
    @Args('id') id: string,
    @Context() context: IContext,
  ): Promise<Board> {
    return this.boardService.addLikeToBoard(context.req.user.id, id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board, {
    description: '게시글의 좋아요를 취소하는 기능 좋아요한 게시글에게만 동작',
  })
  removeLikeToBoard(
    @Args('id') id: string,
    @Context() context: IContext,
  ): Promise<Board> {
    return this.boardService.removeLikeToBoard(context.req.user.id, id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board, {
    description: '게시글에 댓글을 달 수 있는 기능',
  })
  addReply(
    @Context() context: IContext,
    @Args('detail') detail: string,
    @Args('id') id: string,
  ): Promise<Board> {
    return this.boardService.addReply(context.req.user.id, detail, id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board, {
    description: '게시글에 댓글을 삭제 할 수 있는 기능',
  })
  removeReply(
    @Context() context: IContext,
    @Args('reply_id') reply_id: string,
  ): Promise<Board> {
    return this.boardService.removeReply(context.req.user.id, reply_id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board, {
    description: '게시글에 댓글을 수정 할 수 있는 기능',
  })
  updateReply(
    @Args('detail') detail: string,
    @Args('reply_id') reply_id: string,
    @Context() context: IContext,
  ): Promise<Board> {
    return this.boardService.updateReply(detail, reply_id, context.req.user.id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board, {
    description:
      '댓글의 좋아요 수(Like)를 올려주고 Like_user_record에 좋아요한 회원과 댓글글을 저장',
  })
  addLikeToReply(
    @Args('reply_id') reply_id: string,
    @Context() context: IContext,
  ): Promise<Board> {
    return this.boardService.addLikeToReply(context.req.user.id, reply_id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board, {
    description: '댓글의 좋아요를 취소하는 기능 좋아요한 댓글에게만 동작',
  })
  reomoveLikeToReply(
    @Args('reply_id') reply_id: string,
    @Context() context: IContext,
  ): Promise<Board> {
    return this.boardService.removeLikeToReply(context.req.user.id, reply_id);
  }
}
