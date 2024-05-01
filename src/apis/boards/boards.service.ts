import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { UpdateBoardInput } from './dto/update-board.input';
import { Like } from 'typeorm';
import { SearchBoardInput } from './dto/search_board.input';
import { CreateBoardInput } from './dto/create-board.input';
import { UserService } from '../users/users.service';
import { LikeUserRecord } from '../like/entities/like_user_record.entity';
import { Reply } from './entities/reply.entity';
import { NotificationService } from '../notifications/notifications.service';
import { PointService } from '../point/point.service';
import { PostImage } from '../post_image/entities/postImage.entity';
import { PostImageService } from '../post_image/postImage.service';
import { isArray } from 'class-validator';
import * as path from 'path';
@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(LikeUserRecord)
    private readonly likeUserRecordRepository: Repository<LikeUserRecord>,
    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => PointService))
    private readonly pointService: PointService,
    @Inject(forwardRef(() => PostImageService))
    private readonly postImageService: PostImageService,
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

  async findByUserId(user_id: string): Promise<Board[]> {
    return await this.boardRepository.find({
      where: { user: { id: user_id } },
      relations: ['user', 'reply', 'like_user'],
    });
  }

  async findBySerach(searchBoardInput: SearchBoardInput): Promise<Board[]> {
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

  async findTopBoards(category: string, rank: number): Promise<Board[]> {
    const boards = await this.boardRepository.find({
      where: { category: category },
      order: { like: 'DESC' },
      relations: ['user'],
      take: rank,
    });

    for (const rankBoard of boards) {
      await this.pointService.increase(rankBoard.user.id, +100);
    }
    return boards;
  }

  async create(
    folder: string,
    file: Express.Multer.File | Express.Multer.File[],
    user_id: string,
    createBoardInput: CreateBoardInput,
  ): Promise<Board> {
    const { title, detail, category } = createBoardInput;
    const user = await this.userService.findById(user_id);
    const board = new Board();

    const imgUrl: string | string[] = await this.postImageService.saveImageToS3(
      folder,
      file,
    );
    if (Array.isArray(imgUrl)) {
      for (const url of imgUrl) {
        const postImage = new PostImage();
        postImage.board = board;
        postImage.imagePath = url;
        await this.postImageRepository.save(postImage);
        board.post_images.push(postImage);
      }
    } else {
      const postImage = new PostImage();
      postImage.board = board;
      postImage.imagePath = imgUrl;
      await this.postImageRepository.save(postImage);
      board.post_images.push(postImage);
    }

    board.title = title;
    board.detail = detail;
    board.category = category;
    board.create_at = new Date();
    board.user = user;
    await this.pointService.increase(user.id, +10);
    return await this.boardRepository.save(board);
  }

  async update(
    folder: string,
    file: Express.Multer.File | Express.Multer.File[],
    user_id: string,
    updateBoradInput: UpdateBoardInput,
  ): Promise<Board> {
    const { id, ...rest } = updateBoradInput;
    const board = await this.findById(id);
    if (!board) {
      throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
    }
    if (board.user.id !== user_id) {
      throw new ForbiddenException(
        `본인이 작성한 게시글만 수정할 수 있습니다.`,
      );
    }
    for (const post_image of board.post_images) {
      await this.postImageService.deleteImageFromS3(post_image.imagePath);
      await this.postImageRepository.delete(post_image.id);
    }
    board.post_images = [];
    let imgUrl: string | string[];
    if (Array.isArray(file)) {
      for (const item of file) {
        imgUrl = await this.postImageService.saveImageToS3(folder, item);
        const postImage = new PostImage();
        postImage.board = board;
        if (!Array.isArray(imgUrl)) postImage.imagePath = imgUrl;
        await this.postImageRepository.save(postImage);
        board.post_images.push(postImage);
      }
    } else {
      imgUrl = await this.postImageService.saveImageToS3(folder, file);
      const postImage = new PostImage();
      postImage.board = board;
      if (!Array.isArray(imgUrl)) postImage.imagePath = imgUrl;
      await this.postImageRepository.save(postImage);
      board.post_images.push(postImage);
    }

    await this.boardRepository.update({ id: id }, { ...rest });
    return await this.boardRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
  }

  async delete(user_id: string, board_id: string): Promise<boolean> {
    const board = await this.findById(board_id);
    if (!board) {
      throw new NotFoundException(
        `ID가 ${board_id}인 게시글을 찾을 수 없습니다.`,
      );
    }
    if (board.user.id !== user_id) {
      throw new ForbiddenException(
        `본인이 작성한 게시글만 수정할 수 있습니다.`,
      );
    }
    for (const post_image of board.post_images) {
      await this.postImageService.deleteImageFromS3(post_image.imagePath);
    }
    await this.pointService.increase(board.user.id, -10);
    const result = await this.boardRepository.delete(board_id);
    return result.affected ? true : false;
  }
  async addViewCount(id: string): Promise<Board> {
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

  async addLike(user_id: string, id: string): Promise<Board> {
    const board = await this.findById(id);
    const like_user_record = new LikeUserRecord();
    const user = await this.userService.findById(user_id);
    const checkuser = await this.likeUserRecordRepository.findOne({
      where: { board: { id: board.id }, user: { id: user.id } },
      relations: ['user', 'board'],
    });
    if (board.user.id === user_id) {
      throw new ForbiddenException('자신의 게시글은 좋아요 할 수 없습니다');
    }
    if (checkuser) {
      throw new ForbiddenException(`이미 좋아요한 게시글 입니다.`);
    }
    await this.pointService.increase(board.user.id, +5);
    board.like = board.like + 1;
    like_user_record.board = board;
    like_user_record.user = user;
    board.like_user.push(like_user_record);
    const like = await this.likeUserRecordRepository.save(like_user_record);
    await this.boardRepository.save(board);
    await this.notificationService.create(like.id, '202');
    return await this.findById(id);
  }

  async deleteLike(user_id: string, id: string): Promise<Board> {
    const board = await this.findById(id);
    const user = await this.userService.findById(user_id);
    const checkuser = await this.likeUserRecordRepository.findOne({
      where: { board: { id: board.id }, user: { id: user.id } },
      relations: ['user', 'board'],
    });
    if (!checkuser) {
      throw new NotFoundException('좋아요를 하지 않았습니다.');
    }
    await this.pointService.increase(board.user.id, -5);
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
    await this.pointService.increase(user.id, 1);
    reply.user = user;
    reply.board = board;
    reply.detail = detail;
    board.reply.push(reply);
    const result = await this.replyRepository.save(reply);
    await this.boardRepository.save(board);
    await this.notificationService.create(result.id, '300');
    return await this.findById(id);
  }
  async deleteReply(user_id: string, reply_id: string): Promise<Board> {
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
    await this.pointService.increase(user_id, -1);
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

  async addReplyLike(user_id: string, reply_id: string): Promise<Board> {
    const reply = await this.replyRepository.findOne({
      where: { id: reply_id },
      relations: ['like_user', 'board', 'user'],
    });
    const like_user_record = new LikeUserRecord();
    const user = await this.userService.findById(user_id);
    const checkreply = await this.likeUserRecordRepository.findOne({
      where: { reply: { id: reply.id }, user: { id: user.id } },
      relations: ['user', 'reply'],
    });
    await this.pointService.increase(reply.user.id, 5);
    if (reply.user.id === user_id) {
      throw new ForbiddenException('자신의 댓글은 좋아요 할 수 없습니다');
    }
    if (checkreply) {
      throw new ForbiddenException(`이미 좋아요한 댓글 입니다.`);
    }
    reply.like = reply.like + 1;
    like_user_record.reply = reply;
    like_user_record.user = user;
    reply.like_user.push(like_user_record);
    const like = await this.likeUserRecordRepository.save(like_user_record);
    await this.replyRepository.save(reply);
    await this.notificationService.create(like.id, '203');
    return await this.findById(reply.board.id);
  }

  async deleteReplyLike(user_id: string, reply_id: string): Promise<Board> {
    const reply = await this.replyRepository.findOne({
      where: { id: reply_id },
      relations: ['like_user', 'board'],
    });
    const checkreply = await this.likeUserRecordRepository.findOne({
      where: { reply: { id: reply_id }, user: { id: user_id } },
      relations: ['user', 'reply'],
    });
    await this.pointService.increase(reply.user.id, -5);
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

  async findReplyById(reply_id: string): Promise<Reply> {
    return await this.replyRepository.findOne({
      where: { id: reply_id },
      relations: ['user', 'board', 'board.user'],
    });
  }
}
