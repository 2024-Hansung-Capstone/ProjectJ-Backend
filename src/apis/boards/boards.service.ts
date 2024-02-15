import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {Board} from './entities/board.entity'
import { UpdateBoardDto } from "./dto/create-board.input";
import {Like} from 'typeorm';
@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private readonly boardRepository :Repository<Board>,
    ){}

    async getAllBoards(): Promise<Board[]> {
        return this.boardRepository.find();
    }

    async getBoardById(user_id : string) :Promise<Board> {
        return this.boardRepository.findOne({ where: { id: user_id } });
    }

    async getBoardByCategory(category : string) :Promise<Board[]> {
        return this.boardRepository.find({ where: { category : category } });
    }

    async getBoardsByContent(content: string):Promise<Board[]>{
        return this.boardRepository.find({
            where: {
                detail: Like('%${content}%'),
            },
        })
    }

    async createBoard(board: Board):Promise<Board> {
        const newBoard = this.boardRepository.create(board)
        return this.boardRepository.save(newBoard)
    }
    async updateBoard(user_id : string, board: UpdateBoardDto): Promise<Board> {
        await this.boardRepository.update(user_id,board)
        return this.boardRepository.findOne({ where: { id: user_id } })
    }
    async deleteBoard(user_id : string) : Promise<Board> {
        const boardToRemove =await this.boardRepository.findOne({ where: { id: user_id } })
        return this.boardRepository.remove(boardToRemove);
    }
   


}