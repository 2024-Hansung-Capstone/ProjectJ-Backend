import {Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import {BoardService} from './boards.service';
import {Board} from './entities/board.entity';
import { UpdateBoardDto } from './dto/create-board.input';

@Resolver('Board')
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {}

  @Query(() => [Board])
  async getAllBoards() {
    return this.boardService.getAllBoards();
  }

  @Query(() => Board)
  async getBoardById(@Args('id') id: string) {
    return this.boardService.getBoardById(id);
  }

  @Query(() => [Board])
  async getBoardByCategory(@Args('category') category: string) {
    return this.boardService.getBoardByCategory(category);
  }

  @Query(()=> [Board])
  async getBoardsByContent(@Args('content') content: string) {
    return this.boardService.getBoardsByContent(content);
  }

  @Mutation(() => Board)
  async createBoard(@Args('input') input: Board) {
    return this.boardService.createBoard(input);
  }

  @Mutation(() => Board)
  async updateBoard(@Args('id') id: string, @Args('input') input: UpdateBoardDto) {
    return this.boardService.updateBoard(id, input);
  }

  @Mutation(() => Board)
  async deleteBoard(@Args('id') id: string) {
    return this.boardService.deleteBoard(id);
  }
}