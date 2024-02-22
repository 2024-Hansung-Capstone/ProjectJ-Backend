import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PessimisticLockTransactionRequiredError, Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { UpdateBoardDto } from './dto/update-board.input';
import { Like } from 'typeorm';
import { SearchBoardDto } from './dto/search_board.input';
import { CreateBoardDto } from './dto/create-board.input';
import { UserService } from '../users/users.service';
import { Like_user_record } from '../used_markets/entities/like_user_record.entity';
import { Reply } from './entities/reply.entity';
@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(Like_user_record)
    private readonly likeUserRecordRepository: Repository<Like_user_record>,
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    private readonly userService: UserService,
  ) {}

  async findAll(category: string): Promise<Board[]> {
    return await this.boardRepository.find({
      where: { category: category },
      relations: ['user', 'reply'],
    });
  }

  async findById(id: string): Promise<Board> {
    return await this.boardRepository.findOne({
      where: { id: id },
      relations: ['user', 'reply', 'likeUsers'],
    });
  }

  async findByuser_Id(user_id: string): Promise<Board[]> {
    return await this.boardRepository.find({
      where: { user: { id: user_id } },
      relations: ['user', 'reply'],
    });
  }

  async findBySerach(searchBoardInput: SearchBoardDto): Promise<Board[]> {
    const { title, detail, category } = searchBoardInput;
    const searchConditions: any = {};
    if (category) {
      searchConditions.category = category;
    }

    if (title) {
      searchConditions.title = Like(`%${title}%`);
    }

    if (detail) {
      searchConditions.detail = Like(`%${detail}%`);
    }

    return await this.boardRepository.find({ where: searchConditions });
  }

  async findByView(category: string): Promise<Board[]> {
    return await this.boardRepository.find({
      where: { category: category },
      order: { like: 'DESC' },
      take: 5,
    });
  }

  async create(
    user_id: string,
    createBoardInput: CreateBoardDto,
  ): Promise<Board> {
    const { title, detail, category } = createBoardInput;
    const user = await this.userService.findById(user_id);
    const board = new Board();
    board.title = title;
    board.detail = detail;
    board.category = category;
    board.createat = new Date();
    board.user = user;
    return await this.boardRepository.save(board);
  }
  async update(
    user_id: string,
    updateBoradInput: UpdateBoardDto,
  ): Promise<Board> {
    const { id, ...rest } = updateBoradInput;
    const board = await this.findById(id);
    if (!board) {
      throw new NotFoundException(`Id가 ${id}인 것을 찾을 수 없습니다.`);
    }
    if (board.user.id !== user_id) {
      throw new ForbiddenException(
        `본인이 작성한 게시글만 수정할 수 있습니다.`,
      );
    }
    await this.boardRepository.update({ id: id }, { ...rest });
    return await this.boardRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
  }
  async delete(user_id: string, id: string): Promise<boolean> {
    const board = await this.findById(id);
    if (!board) {
      throw new NotFoundException(`Id가 ${id}인 것을 찾을 수 없습니다.`);
    }
    if (board.user.id !== user_id) {
      throw new ForbiddenException(
        `본인이 작성한 게시글만 수정할 수 있습니다.`,
      );
    }
    const result = await this.boardRepository.delete(id);
    return result.affected ? true : false;
  }
  async addViewToPost(id: string): Promise<Board> {
    const board = await this.findById(id);
    if (!board) {
      throw new NotFoundException(`Id가 ${id}인 것을 찾을 수 없습니다.`);
    }
    board.view = board.view + 1;

    await this.boardRepository.save(board);
    return await this.boardRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
  }

  async addLikeToPost(user_id: string, id: string): Promise<Board> {
    const board = await this.findById(id);
    const like_user_record = new Like_user_record();
    const user = await this.userService.findById(user_id);
    const checkuser = await this.likeUserRecordRepository.findOne({
      where: { board: { id: board.id }, user: { id: user.id } },
      relations: ['user', 'board'],
    });

    if (checkuser) {
      throw new ForbiddenException(`이미 찜한 게시글 입니다.`);
    }
    board.like = board.like + 1;
    like_user_record.board = board;
    like_user_record.user = user;
    board.likeUsers.push(like_user_record);
    await this.likeUserRecordRepository.save(like_user_record);
    await this.boardRepository.save(board);
    return await this.findById(id);
  }

  async removeLikeToPost(user_id: string, id: string): Promise<Board> {
    const board = await this.findById(id);
    const user = await this.userService.findById(user_id);
    const checkuser = await this.likeUserRecordRepository.findOne({
      where: { board: { id: board.id }, user: { id: user.id } },
      relations: ['user', 'board'],
    });
    if (!checkuser) {
      throw new NotFoundException('찜을 하지 않았습니다.');
    }

    board.like = board.like - 1;
    const likeIndex = board.likeUsers.findIndex(
      (likeUsers) => likeUsers.id === checkuser.id,
    );
    board.likeUsers.splice(likeIndex, 1);
    await this.likeUserRecordRepository.delete(checkuser.id);
    await this.boardRepository.save(board);
    return await this.findById(id);
  }
  async addReply(user_id: string, detail: string, id: string): Promise<Board> {
    const board = await this.findById(id);
    const user = await this.userService.findById(user_id);
    const reply = new Reply();
    reply.user = user;
    reply.board = board;
    reply.detail = detail;
    board.reply.push(reply);
    await this.replyRepository.save(reply);
    await this.boardRepository.save(board);
    return await this.findById(id);
  }
  async removeReply(user_id: string, id: string): Promise<Board> {
    const board = await this.findById(id);
    const user = await this.userService.findById(user_id);
    const checkreply = await this.replyRepository.findOne({
      where: { board: { id: board.id }, user: { id: user.id } },
      relations: ['user', 'board'],
    });
    if (!checkreply) {
      throw new NotFoundException('댓글이 존재하지 않습니다.');
    }
    const replyIndex = board.reply.findIndex(
      (reply) => reply.id === checkreply.id,
    );
    board.likeUsers.splice(replyIndex, 1);
    await this.replyRepository.delete(checkreply.id);
    await this.boardRepository.save(board);
    return await this.findById(id);
  }
}
