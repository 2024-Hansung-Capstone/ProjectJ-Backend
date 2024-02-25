import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, LessThanOrEqual, Repository } from 'typeorm';
import { CreateUsedProductInput } from './dto/create-usedProducts.input';
import { UsedProduct } from './entities/used_product.entity';
import { UpdateUsedProductInput } from './dto/update-usedProducts.input';
import { SearchProductInput } from './dto/search-usedProducts.input';
import { Like_user_record } from './entities/like_user_record.entity';
import { UserService } from '../users/users.service';
@Injectable()
export class UsedProductService {
  constructor(
    @InjectRepository(UsedProduct)
    private usedProductRepository: Repository<UsedProduct>,
    @InjectRepository(Like_user_record)
    private likeUserRecordRepository: Repository<Like_user_record>,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<UsedProduct[]> {
    return await this.usedProductRepository.find({
      relations: ['user', 'user.dong', 'user.dong.sgng', 'user.dong.sgng.sido'],
    });
  }

  async findById(id: string): Promise<UsedProduct> {
    return await this.usedProductRepository.findOne({
      where: { id: id },
      relations: [
        'user',
        'user.dong',
        'user.dong.sgng',
        'user.dong.sgng.sido',
        'Like_users',
      ],
    });
  }
  //유저이름으로 검색 즉 상점이름으로 검색하는 방법
  async findByuser_Id(user_id: string): Promise<UsedProduct[]> {
    return await this.usedProductRepository.find({
      where: { user: { id: user_id } },
      relations: ['user', 'user.dong', 'user.dong.sgng', 'user.dong.sgng.sido'],
    });
  }
  // 종합적인 조건으로 검색하는 방법
  async findBySerach(
    searchPostDto: SearchProductInput,
  ): Promise<UsedProduct[]> {
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
    usedProduct: CreateUsedProductInput,
  ): Promise<UsedProduct> {
    const { title, price, detail, category, state } = usedProduct;
    const user = await this.userService.findById(user_id);

    const Used_Product = new UsedProduct();
    Used_Product.title = title;
    Used_Product.price = price;
    Used_Product.detail = detail;
    Used_Product.category = category;
    Used_Product.state = state;
    Used_Product.user = user;
    Used_Product.create_at = new Date(); // DTO에서 받은 create_at 할당
    const newProduct = await this.usedProductRepository.save(Used_Product);
    return await this.findById(newProduct.id);
  }

  async update(
    user_id: string,
    usedProduct: UpdateUsedProductInput,
  ): Promise<UsedProduct> {
    const { id, ...rest } = usedProduct;
    const used_product = await this.findById(id);
    if (!used_product) {
      throw new NotFoundException(`Id가 ${id}인 것을 찾을 수 없습니다.`);
    }
    const user = await this.userService.findById(user_id);

    if (used_product.user.id !== user.id) {
      throw new ForbiddenException(
        `본인이 작성한 게시글만 수정할 수 있습니다.`,
      );
    }
    await this.usedProductRepository.update({ id: id }, { ...rest });
    return await this.usedProductRepository.findOne({
      where: { id: id },
      relations: ['user', 'user.dong', 'user.dong.sgng', 'user.dong.sgng.sido'],
    });
  }

  async delete(user_id: string, id: string): Promise<boolean> {
    const used_product = await this.findById(id);

    if (!used_product) {
      throw new NotFoundException(`Id가 ${id}인 것을 찾을 수 없습니다.`);
    }

    // 사용자 조회
    const user = await this.userService.findById(user_id);

    if (used_product.user.id !== user.id) {
      throw new ForbiddenException(
        `본인이 작성한 게시글만 삭제할 수 있습니다.`,
      );
    }
    const result = await this.usedProductRepository.delete(id);
    return result.affected ? true : false;
  }

  async addViewToPost(id: string): Promise<UsedProduct> {
    const used_product = await this.findById(id);
    if (!used_product) {
      throw new NotFoundException(`Id가 ${id}인 것을 찾을 수 없습니다.`);
    }
    used_product.view = used_product.view + 1;

    return this.usedProductRepository.save(used_product);
  }

  async addLikeToPost(user_id: string, id: string): Promise<UsedProduct> {
    const used_product = await this.findById(id);
    const like_user_record = new Like_user_record();
    const user = await this.userService.findById(user_id);
    const checkuser = await this.likeUserRecordRepository.findOne({
      where: { used_product: { id: used_product.id }, user: { id: user.id } },
      relations: [
        'user',
        'user.dong',
        'user.dong.sgng',
        'user.dong.sgng.sido',
        'used_product',
      ],
    });

    if (checkuser) {
      throw new ForbiddenException(`이미 찜한 게시글 입니다.`);
    }
    used_product.like = used_product.like + 1;
    like_user_record.used_product = used_product;
    like_user_record.user = user;
    used_product.Like_users.push(like_user_record);
    await this.likeUserRecordRepository.save(like_user_record);
    await this.usedProductRepository.save(used_product);
    return this.findById(id);
  }

  async removeLikeToPost(user_id: string, id: string): Promise<UsedProduct> {
    const used_product = await this.findById(id);
    const user = await this.userService.findById(user_id);
    const checkuser = await this.likeUserRecordRepository.findOne({
      where: { used_product: { id: used_product.id }, user: { id: user.id } },
      relations: [
        'user',
        'user.dong',
        'user.dong.sgng',
        'user.dong.sgng.sido',
        'used_product',
      ],
    });
    if (!checkuser) {
      throw new NotFoundException('찜을 하지 않았습니다.');
    }
    const likeIndex = used_product.Like_users.findIndex(
      (Like_users) => Like_users.id === checkuser.id,
    );
    used_product.Like_users.splice(likeIndex, 1);
    used_product.like = used_product.like - 1;

    await this.likeUserRecordRepository.delete(checkuser.id);
    await this.usedProductRepository.save(used_product);
    return this.findById(id);
  }
}
