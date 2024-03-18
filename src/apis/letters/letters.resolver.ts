import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Letter } from './entities/letter.entity';
import { CreateLetterInput } from './dto/create-letter.input';
import { LetterService } from './letters.service';
import { IContext } from '../users/interfaces/user-service.interface';
import { UseGuards } from '@nestjs/common';
import { gqlAccessGuard } from '../users/guards/gql-auth.guard';

@Resolver()
export class LetterResolver {
  constructor(private readonly letterService: LetterService) {}

  //쪽지 작성
  @UseGuards(gqlAccessGuard)
  @Mutation(() => Letter)
  async writeLetter(
    @Args('writing_id') writing_id: string,
    @Args('createLetterInput') createLetterInput: CreateLetterInput,
    @Context() context: IContext,
  ): Promise<Letter> {
    return await this.letterService.writeLetter(
      context.req.user.id,
      writing_id,
      createLetterInput,
    );
  }

  //특정한 쪽지 조회
  @Query(() => Letter)
  async fetchLetterById(@Args('letter_id') letter_id: string): Promise<Letter> {
    return await this.letterService.findById(letter_id);
  }

  //로그인한 사용자가 보낸 쪽지 전부 조회
  @UseGuards(gqlAccessGuard)
  @Query(() => Letter)
  async fetchMySendLetters(@Context() context: IContext): Promise<Letter[]> {
    return await this.letterService.findSendAll(context.req.user.id);
  }

  //로그인한 사용자가 받은 쪽지 전부 조회
  @UseGuards(gqlAccessGuard)
  @Query(() => Letter)
  async fetchMyReceiveLetters(@Context() context: IContext): Promise<Letter[]> {
    return await this.letterService.findReceiveAll(context.req.user.id);
  }

  //쪽지 삭제
  @Mutation(() => Boolean)
  async deleteLetter(@Args('letter_id') letter_id: string): Promise<boolean> {
    return await this.letterService.delete(letter_id);
  }
}
