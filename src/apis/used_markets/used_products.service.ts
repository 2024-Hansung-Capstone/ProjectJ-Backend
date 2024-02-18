import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, LessThanOrEqual, Repository, getRepository } from 'typeorm';
import { CreateProductInput } from './dto/create-used_products.input';
import { Used_product } from './entities/used_product.entity';
import { UpdateUsedProductInput } from './dto/update-used_products.input';
import { SearchProductInput } from './dto/search-used_products.input';
import { AddViewProductInput } from './dto/addview_used_products.input';
import { AddLikeProductInput } from './dto/addlike_used_products.inpput';
import { UpdateUsedProductStateInput } from './dto/update-used_products.state.input';
import { Like_user_record } from './entities/like_user_record.entity';
import { UserService } from '../users/users.service';
@Injectable()
export class UsedProductService {
  constructor(
    @InjectRepository(Used_product)
    private usedProductRepository: Repository<Used_product>,
    @InjectRepository(Like_user_record)
    private likeUserRecordRepository: Repository<Like_user_record>,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<Used_product[]> {
    return await this.usedProductRepository.find({});
  }

  async findById(id: string): Promise<Used_product> {
    return await this.usedProductRepository.findOne({
      where: { id: id },
    });
  }
  //유저이름으로 검색 즉 상점이름으로 검색하는 방법
  async findByuser_Id(user_id: string): Promise<Used_product[]> {
    return await this.usedProductRepository.find({
      where: { user: { id: user_id } },
      relations: ['user'],
    });
  }
  // 종합적인 조건으로 검색하는 방법
  async findBySerach(
    searchPostDto: SearchProductInput,
  ): Promise<Used_product[]> {
    const { title, price, detail, category, state } = searchPostDto;
    const searchConditions: any = {};
    if (category) {
      searchConditions.category = category;
    }
    if (price) {
      searchConditions.price = LessThanOrEqual(price);
    }
    if (title) {
      searchConditions.title = Like(`%${title}%`);
    }

    if (detail) {
      searchConditions.detail = Like(`%${detail}%`);
    }
    if (state) {
      searchConditions.state = state;
    }
    return await this.usedProductRepository.find({ where: searchConditions });
  }

  async create(
    user_id: string,
    usedProduct: CreateProductInput,
  ): Promise<Used_product> {
    const { title, price, detail, category, state } = usedProduct;
    const user = await this.userService.findById(user_id);

    const Used_Product = new Used_product();
    Used_Product.title = title;
    Used_Product.price = price;
    Used_Product.detail = detail;
    Used_Product.category = category;
    Used_Product.state = state;
    Used_Product.user = user;
    Used_Product.create_at = new Date(); // DTO에서 받은 create_at 할당
    return await this.usedProductRepository.save(Used_Product);
  }

  async update(
    id: string,
    usedProduct: UpdateUsedProductInput,
    user_id: string,
  ): Promise<Used_product> {
    const used_product = await this.findById(id);
    const { title, price, detail, category, state } = usedProduct;
    if (!used_product) {
      throw new NotFoundException(`Id가 ${id}인 것을 찾을 수 없습니다.`);
    }
    const user = await this.userService.findById(user_id);
    const now_user = await this.userService.findById(used_product.user.id);
    if (now_user.id !== user.id) {
      throw new ForbiddenException(
        `본인이 작성한 게시글만 수정할 수 있습니다.`,
      );
    }
    used_product.title = title;
    used_product.price = price;
    used_product.detail = detail;
    used_product.category = category;
    used_product.state = state;
    await this.usedProductRepository.save(used_product);
    return await this.usedProductRepository.findOne({ where: { id: id } });
  }

  async updateDealState(
    UpdateUsed_ProductStateInput: UpdateUsedProductStateInput,
    user_id: string,
  ): Promise<Used_product> {
    const used_product = await this.findById(UpdateUsed_ProductStateInput.id);
    const user = await this.userService.findById(user_id);
    const now_user = await this.userService.findById(used_product.user.id);
    if (now_user.id !== user.id) {
      throw new ForbiddenException(
        `본인이 작성한 게시글만 상태를 수정할 수 있습니다.`,
      );
    }
    used_product.state = UpdateUsed_ProductStateInput.state;
    return await this.usedProductRepository.save(used_product);
  }

  async delete(user_id: string, id: string): Promise<boolean> {
    const used_product = await this.findById(id);

    if (!used_product) {
      throw new NotFoundException(`Id가 ${id}인 것을 찾을 수 없습니다.`);
    }

    // 사용자 조회
    const user = await this.userService.findById(user_id);
    const now_user = await this.userService.findById(used_product.user.id);
    if (now_user.id !== user.id) {
      throw new ForbiddenException(
        `본인이 작성한 게시글만 삭제할 수 있습니다.`,
      );
    }
    const result = await this.usedProductRepository.delete(id);
    return result.affected ? true : false;
  }

  async addViewToPost(
    AddViewProductInput: AddViewProductInput,
  ): Promise<Used_product> {
    const used_product = await this.findById(AddViewProductInput.id);
    if (!used_product) {
      throw new NotFoundException(
        `Id가 ${AddViewProductInput.id}인 것을 찾을 수 없습니다.`,
      );
    }
    used_product.view = used_product.view + 1;

    return this.usedProductRepository.save(used_product);
  }

  async addLikeToPost(
    AddLikeProductInput: AddLikeProductInput,
    user_id: string,
  ): Promise<Used_product> {
    const used_product = await this.findById(AddLikeProductInput.id);
    const like_user_record = new Like_user_record();
    const user = await this.userService.findById(user_id);
    const checkuser = await this.likeUserRecordRepository.findOne({
      where: { used_product: { id: used_product.id }, user: { id: user.id } },
      relations: ['user', 'used_product'],
    });

    if (checkuser) {
      throw new ForbiddenException(`이미 찜한 게시글 입니다.`);
    }
    used_product.like = used_product.like + 1;
    like_user_record.used_product = used_product;
    like_user_record.user = user;

    await this.likeUserRecordRepository.save(like_user_record);
    await this.usedProductRepository.save(used_product);
    return this.findById(AddLikeProductInput.id);
  }

  async removeLikeToPost(id: string, user_id: string): Promise<Used_product> {
    const used_product = await this.findById(id);
    const user = await this.userService.findById(user_id);
    const checkuser = await this.likeUserRecordRepository.findOne({
      where: { used_product: { id: used_product.id }, user: { id: user.id } },
      relations: ['user', 'used_product'],
    });
    if (!checkuser) {
      throw new NotFoundException('찜을 하지 않았습니다.');
    }

    used_product.like = used_product.like - 1;

    await this.likeUserRecordRepository.delete(checkuser.id);
    await this.usedProductRepository.save(used_product);
    return this.findById(id);
  }
}
