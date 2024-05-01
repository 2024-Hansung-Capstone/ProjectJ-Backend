import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { BoardService } from './boards.service';
import { Board } from './entities/board.entity';
import { UpdateBoardInput } from './dto/update-board.input';
import { SearchBoardInput } from './dto/search_board.input';
import { CreateBoardInput } from './dto/create-board.input';
import { IContext } from '../users/interfaces/user-service.interface';
import { UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { gqlAccessGuard } from '../users/guards/gql-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
@Resolver('Board')
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {}

  @Query(() => [Board], {
    description: '입력된 카테고리에 해당하는 게시글의 정보를 확인합니다.',
  })
  async fetchBoards(
    @Args('category', { description: '게시글 카테고리' }) category: string,
  ): Promise<Board[]> {
    return this.boardService.findAll(category);
  }

  @Query(() => Board, {
    description: '게시글 고유 ID로 게시글 정보를 확인합니다.',
  })
  async fetchBoardById(
    @Args('board_id', { description: '게시글 고유 ID' }) board_id: string,
  ): Promise<Board> {
    return this.boardService.findById(board_id);
  }

  @Query(() => [Board], {
    description:
      '입력된 user_id를 가진 사용자가 작성한 게시글의 정보를 확인합니다.',
  })
  async fetchBoardByUserId(
    @Args('user_id', { description: '사용자 ID' }) user_id: string,
  ): Promise<Board[]> {
    return await this.boardService.findByUserId(user_id);
  }

  @Query(() => [Board], {
    description:
      '종합검색 기능으로 제목과 본문내용은 해당되는 내용이 있으면 검색이 되도록 설계',
  })
  async fetchBoardsBySerach(
    @Args('SerachBoardInput') searchBoardInput: SearchBoardInput,
  ): Promise<Board[]> {
    return this.boardService.findBySerach(searchBoardInput);
  }

  @Query(() => [Board], {
    description: '조회수가 많은 게시글 rank개를 가져옵니다.',
  })
  async fetchBoardsByViewRank(
    @Args('category', { description: '게시글 카테고리' }) category: string,
    @Args('rank', { description: '가져올 게시글 수' }) rank: number,
  ): Promise<Board[]> {
    return this.boardService.findTopBoards(category, rank);
  }

  @UseGuards(gqlAccessGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Mutation(() => Board, {
    description:
      '입력된 정보를 바탕으로 게시글을 작성합니다.(사진이 하나일 때)',
  })
  async createBoard(
    @UploadedFile() file: Express.Multer.File,
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
    @Context() context: IContext,
  ): Promise<Board> {
    return this.boardService.create(
      'post',
      file,
      context.req.user.id,
      createBoardInput,
    );
  }

  @UseGuards(gqlAccessGuard)
  @UseInterceptors(FilesInterceptor('image'))
  @Mutation(() => Board, {
    description:
      '입력된 정보를 바탕으로 게시글을 작성합니다.(사진이 여러 장 일 때)',
  })
  async createBoardWithImages(
    @UploadedFile() files: Express.Multer.File[],
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
    @Context() context: IContext,
  ): Promise<Board> {
    return this.boardService.create(
      'post',
      files,
      context.req.user.id,
      createBoardInput,
    );
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board, {
    description:
      '입력된 id값을 가진 게시글을 수정합니다. (게시글의 유저정보와 로그인 된 유저가 동일해야지만 수정 가능)',
  })
  async updateBoard(
    @Args('updateBoradInput') updateBoradInput: UpdateBoardInput,
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
    @Args('board_id', { description: '게시글 고유 ID' }) board_id: string,
    @Context() context: IContext,
  ): Promise<boolean> {
    return await this.boardService.delete(context.req.user.id, board_id);
  }

  @Mutation(() => Board, {
    description: '게시글의 조회수를 1 증가시킵니다.',
  })
  increaseBoardView(
    @Args('board_id', { description: '게시글 고유 ID' }) board_id: string,
  ): Promise<Board> {
    return this.boardService.addViewCount(board_id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board, {
    description:
      '게시글의  좋아요 수를 올려주고 좋아요한 회원과 게시글 정보를 저장합니다.',
  })
  increaseBoardLike(
    @Args('board_id', { description: '게시글 고유 ID' }) board_id: string,
    @Context() context: IContext,
  ): Promise<Board> {
    return this.boardService.addLike(context.req.user.id, board_id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board, {
    description:
      '게시글의 좋아요를 취소하는 기능입니다. (좋아요한 게시글에게만 동작)',
  })
  decreaseBoardLike(
    @Args('board_id', { description: '게시글 고유 ID' }) board_id: string,
    @Context() context: IContext,
  ): Promise<Board> {
    return this.boardService.deleteLike(context.req.user.id, board_id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board, {
    description: '게시글에 댓글을 생성하는 기능입니다.',
  })
  createReply(
    @Context() context: IContext,
    @Args('board_id', { description: '게시글 고유 ID' }) board_id: string,
    @Args('detail', { description: '댓글 내용' }) detail: string,
  ): Promise<Board> {
    return this.boardService.addReply(context.req.user.id, detail, board_id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board, {
    description: '게시글에 댓글을 삭제하는 기능입니다.',
  })
  deleteReply(
    @Context() context: IContext,
    @Args('reply_id', { description: '댓글 고유 ID' }) reply_id: string,
  ): Promise<Board> {
    return this.boardService.deleteReply(context.req.user.id, reply_id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board, {
    description: '게시글에 댓글을 수정하는 기능입니다.',
  })
  updateReply(
    @Args('reply_id', { description: '댓글 고유 ID' }) reply_id: string,
    @Args('detail', { description: '댓글 내용' }) detail: string,
    @Context() context: IContext,
  ): Promise<Board> {
    return this.boardService.updateReply(detail, reply_id, context.req.user.id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board, {
    description:
      '댓글의 좋아요 수를 올려주고 좋아요한 회원과 댓글 정보를 저장합니다.',
  })
  increaseReplyLike(
    @Args('reply_id', { description: '댓글 고유 ID' }) reply_id: string,
    @Context() context: IContext,
  ): Promise<Board> {
    return this.boardService.addReplyLike(context.req.user.id, reply_id);
  }

  @UseGuards(gqlAccessGuard)
  @Mutation(() => Board, {
    description:
      '댓글의 좋아요를 취소하는 기능입니다. (좋아요한 댓글에게만 동작)',
  })
  decreaseReplyLike(
    @Args('reply_id', { description: '댓글 고유 ID' }) reply_id: string,
    @Context() context: IContext,
  ): Promise<Board> {
    return this.boardService.deleteReplyLike(context.req.user.id, reply_id);
  }
}
