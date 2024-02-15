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
import { User } from '../users/entities/user.entity';
import { AddViewProductInput } from './dto/addview_used_products.input';
import { AddLikeProductInput } from './dto/addlike_used_products.inpput';
import { IContext } from '../users/interfaces/user-service.interface';
import { UpdateUsedProductStateInput } from './dto/update-used_products.state.input';
import { Like_user_record } from './entities/like_user_record.entity';
@Injectable()
export class UsedProductService {
  constructor(
    @InjectRepository(Used_product)
    private usedProductRepository: Repository<Used_product>,
  ) {}

  async findAll(): Promise<Used_product[]> {
    return this.usedProductRepository.find();
  }

  async findById(id: string): Promise<Used_product> {
    return this.usedProductRepository.findOne({ where: { id: id } });
  }
  //유저이름으로 검색 즉 상점이름으로 검색하는 방법
  async findByuser_Id(user_id: string): Promise<Used_product[]> {
    const userRepository = getRepository(User);

    // 사용자 조회
    const user = await userRepository.findOne({ where: { id: user_id } });
    return this.usedProductRepository.find({ where: { user_id: user } });
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
    return this.usedProductRepository.find({ where: searchConditions });
  }

  async create(
    usedProduct: CreateProductInput,
    context: IContext,
  ): Promise<Used_product> {
    const { title, price, detail, category, state } = usedProduct;
    const user = await this.findUserById(context);

    const Used_Product = new Used_product();
    Used_Product.title = title;
    Used_Product.price = price;
    Used_Product.detail = detail;
    Used_Product.category = category;
    Used_Product.state = state;
    Used_Product.user_id = user;
    Used_Product.create_at = new Date(); // DTO에서 받은 create_at 할당
    return await this.usedProductRepository.save(Used_Product);
  }

  async update(
    id: string,
    usedProduct: UpdateUsedProductInput,
    context: IContext,
  ): Promise<Used_product> {
    const used_product = await this.findById(id);
    if (!used_product) {
      throw new NotFoundException(`Id가 ${id}인 것을 찾을 수 없습니다.`);
    }
    const user = await this.findUserById(context);
    if (used_product.user_id.id !== user.id) {
      throw new ForbiddenException(
        `본인이 작성한 게시글만 수정할 수 있습니다.`,
      );
    }
    await this.usedProductRepository.update(id, usedProduct);
    return this.usedProductRepository.findOne({ where: { id: id } });
  }

  async updateDealState(
    UpdateUsed_ProductStateInput: UpdateUsedProductStateInput,
    context: IContext,
  ): Promise<Used_product> {
    const used_product = await this.findById(UpdateUsed_ProductStateInput.id);
    const user = await this.findUserById(context);
    if (used_product.user_id.id !== user.id) {
      throw new ForbiddenException(
        `본인이 작성한 게시글만 상태를 수정할 수 있습니다.`,
      );
    }
    used_product.state = UpdateUsed_ProductStateInput.state;
    return this.usedProductRepository.save(used_product);
  }

  async delete(context: IContext, id: string): Promise<void> {
    const used_product = await this.findById(id);
    if (!used_product) {
      throw new NotFoundException(`Id가 ${id}인 것을 찾을 수 없습니다.`);
    }

    // 사용자 조회
    const user = await this.findUserById(context);
    if (used_product.user_id.id !== user.id) {
      throw new ForbiddenException(
        `본인이 작성한 게시글만 삭제할 수 있습니다.`,
      );
    }
    await this.usedProductRepository.delete(id);
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
    context: IContext,
  ): Promise<Used_product> {
    const used_product = await this.findById(AddLikeProductInput.id);
    const like_user_recordRepository = getRepository(Like_user_record);
    const like_user_record = new Like_user_record();
    const user = await this.findUserById(context);
    const checkuser = await like_user_recordRepository.findOne({
      where: { used_product: used_product, user: user },
    });

    if (checkuser) {
      throw new ForbiddenException(`이미 찜한 게시글 입니다.`);
    }
    used_product.view = used_product.view + 1;
    like_user_record.used_product = used_product;
    like_user_record.user = user;

    await like_user_recordRepository.save(like_user_record);
    return this.usedProductRepository.save(used_product);
  }

  async removeLikeToPost(id: string, context: IContext): Promise<Used_product> {
    const used_product = await this.findById(id);
    const like_user_recordRepository = getRepository(Like_user_record);
    const user = await this.findUserById(context);
    const checkuser = await like_user_recordRepository.findOne({
      where: { used_product: used_product, user: user },
    });
    if (!checkuser) {
      throw new NotFoundException('찜을 하지 않았습니다.');
    }

    used_product.view = used_product.view - 1;

    await like_user_recordRepository.delete(checkuser.id);
    return this.usedProductRepository.save(used_product);
  }

  async findUserById(context: IContext): Promise<User> {
    const userRepository = getRepository(User);
    return userRepository.findOne({
      where: { id: context.req.user.id },
    });
  }
}
