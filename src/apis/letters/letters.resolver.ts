import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Letter } from './entities/letter.entity';
import { CreateLetterInput } from './dto/create-letter.input';
import { LetterService } from './letters.service';
import { IContext } from '../users/interfaces/user-service.interface';

@Resolver()
export class LetterResolver {
  constructor(private readonly letterService: LetterService) {}

  //쪽지 작성
  @Mutation(() => Letter)
  async writeLetter(
    @Args('createLetterInput') createLetterInput: CreateLetterInput,
    @Context() context: IContext,
  ): Promise<Letter> {
    return await this.letterService.writeLetter(
      context.req.user.id,
      createLetterInput,
    );
  }

  //특정한 쪽지 조회
  @Query(() => Letter)
  async fetchLetterById(@Args('letter_id') letter_id: string): Promise<Letter> {
    return await this.letterService.findById(letter_id);
  }
}
