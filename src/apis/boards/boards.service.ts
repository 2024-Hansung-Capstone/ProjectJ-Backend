import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      relations: ['user', 'reply', 'like_user'],
    });
  }

  async findById(id: string): Promise<Board> {
    return await this.boardRepository.findOne({
      where: { id: id },
      relations: ['user', 'reply', 'like_user'],
    });
  }

  async findByuser_Id(user_id: string): Promise<Board[]> {
    return await this.boardRepository.find({
      where: { user: { id: user_id } },
      relations: ['user', 'reply', 'like_user'],
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
  async addViewToBoard(id: string): Promise<Board> {
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

  async addLikeToBoard(user_id: string, id: string): Promise<Board> {
    const board = await this.findById(id);
    const like_user_record = new Like_user_record();
    const user = await this.userService.findById(user_id);
    const checkuser = await this.likeUserRecordRepository.findOne({
      where: { board: { id: board.id }, user: { id: user.id } },
      relations: ['user', 'board'],
    });

    if (checkuser) {
      throw new ForbiddenException(`이미 좋아요한 게시글 입니다.`);
    }
    board.like = board.like + 1;
    like_user_record.board = board;
    like_user_record.user = user;
    board.like_user.push(like_user_record);
    await this.likeUserRecordRepository.save(like_user_record);
    await this.boardRepository.save(board);
    return await this.findById(id);
  }

  async removeLikeToBoard(user_id: string, id: string): Promise<Board> {
    const board = await this.findById(id);
    const user = await this.userService.findById(user_id);
    const checkuser = await this.likeUserRecordRepository.findOne({
      where: { board: { id: board.id }, user: { id: user.id } },
      relations: ['user', 'board'],
    });
    if (!checkuser) {
      throw new NotFoundException('좋아요를 하지 않았습니다.');
    }

    board.like = board.like - 1;
    const likeIndex = board.like_user.findIndex(
      (likeUsers) => likeUsers.id === checkuser.id,
    );
    board.like_user.splice(likeIndex, 1);
    await this.likeUserRecordRepository.delete(checkuser.id);
    await this.boardRepository.save(board);
    return await this.findById(id);
  }
  async addReply(user_id: string, detail: string, id: string): Promise<Board> {
    const board = await this.findById(id);
    const user = await this.userService.findById(user_id);
    const reply = new Reply();
    if (
      detail.includes('씨발') ||
      detail.includes('개새끼') ||
      detail.includes('병신')
    ) {
      throw new HttpException(
        '댓글 내용에 욕이 포함되어 있어 작성할 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    reply.user = user;
    reply.board = board;
    reply.detail = detail;
    board.reply.push(reply);
    await this.replyRepository.save(reply);
    await this.boardRepository.save(board);
    return await this.findById(id);
  }
  async removeReply(user_id: string, reply_id: string): Promise<Board> {
    const checkreply = await this.replyRepository.findOne({
      where: { id: reply_id },
      relations: ['user', 'board'],
    });
    const board = await this.findById(checkreply.board.id);
    if (checkreply.user.id !== user_id) {
      throw new ForbiddenException(`본인이 작성한 댓글만 삭제할 수 있습니다.`);
    }
    if (!checkreply) {
      throw new NotFoundException('댓글이 존재하지 않습니다.');
    }
    const replyIndex = board.reply.findIndex(
      (reply) => reply.id === checkreply.id,
    );
    board.reply.splice(replyIndex, 1);
    await this.replyRepository.delete(checkreply.id);
    await this.boardRepository.save(board);
    return await this.findById(board.id);
  }

  async updateReply(
    detail: string,
    reply_id: string,
    user_id: string,
  ): Promise<Board> {
    const checkreply = await this.replyRepository.findOne({
      where: { id: reply_id },
      relations: ['user', 'board'],
    });
    if (checkreply.user.id !== user_id) {
      throw new ForbiddenException(`본인이 작성한 댓글만 수정할 수 있습니다.`);
    }
    if (!checkreply) {
      throw new NotFoundException('댓글이 존재하지 않습니다.');
    }
    if (
      detail.includes('씨발') ||
      detail.includes('개새끼') ||
      detail.includes('병신')
    ) {
      throw new HttpException(
        '댓글 내용에 욕이 포함되어 있어 작성할 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.replyRepository.update(
      { id: checkreply.id },
      { detail: detail },
    );
    return await this.findById(checkreply.board.id);
  }

  async addLikeToReply(user_id: string, reply_id: string): Promise<Board> {
    const reply = await this.replyRepository.findOne({
      where: { id: reply_id },
      relations: ['like_user', 'board'],
    });
    const like_user_record = new Like_user_record();
    const user = await this.userService.findById(user_id);
    const checkreply = await this.likeUserRecordRepository.findOne({
      where: { reply: { id: reply.id }, user: { id: user.id } },
      relations: ['user', 'reply'],
    });

    if (checkreply) {
      throw new ForbiddenException(`이미 좋아요한 댓글 입니다.`);
    }
    reply.like = reply.like + 1;
    like_user_record.reply = reply;
    like_user_record.user = user;
    reply.like_user.push(like_user_record);
    await this.likeUserRecordRepository.save(like_user_record);
    await this.replyRepository.save(reply);
    return await this.findById(reply.board.id);
  }

  async removeLikeToReply(user_id: string, reply_id: string): Promise<Board> {
    const reply = await this.replyRepository.findOne({
      where: { id: reply_id },
      relations: ['like_user', 'board'],
    });
    const checkreply = await this.likeUserRecordRepository.findOne({
      where: { reply: { id: reply_id }, user: { id: user_id } },
      relations: ['user', 'reply'],
    });

    if (!checkreply) {
      throw new ForbiddenException(`좋아요를 하지 않았습니다.`);
    }
    reply.like = reply.like - 1;
    const likeIndex = reply.like_user.findIndex(
      (reply) => reply.id === checkreply.id,
    );
    reply.like_user.splice(likeIndex, 1);
    await this.likeUserRecordRepository.delete(checkreply.id);
    await this.boardRepository.save(reply);
    return await this.findById(reply.board.id);
  }
}
