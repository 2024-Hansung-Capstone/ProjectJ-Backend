import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, LessThanOrEqual, Repository } from 'typeorm';
import { CreateUsedProductInput } from './dto/create-usedProducts.input';
import { UsedProduct } from './entities/used_product.entity';
import { UpdateUsedProductInput } from './dto/update-usedProducts.input';
import { SearchProductInput } from './dto/search-usedProducts.input';
import { LikeUserRecord } from '../like/entities/like_user_record.entity';
import { UserService } from '../users/users.service';
import { LikeUserRecordService } from '../like/like_user_record.service';
import { NotificationService } from '../notifications/notifications.service';
import { PostImageService } from '../post_image/postImage.service';
@Injectable()
export class UsedProductService {
  private imageFolder = 'used_product';

  constructor(
    @InjectRepository(UsedProduct)
    private usedProductRepository: Repository<UsedProduct>,
    @InjectRepository(LikeUserRecord)
    private likeUserRecordRepository: Repository<LikeUserRecord>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly likeUserRecordService: LikeUserRecordService,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
    private readonly postImageService: PostImageService,
  ) {}

  async findAll(): Promise<UsedProduct[]> {
    return await this.usedProductRepository.find({
      relations: [
        'user',
        'user.dong',
        'user.dong.sgng',
        'user.dong.sgng.sido',
        'like_user',
        'like_user.user',
        'post_images',
      ],
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
        'like_user',
        'like_user.user',
        'post_images',
      ],
    });
  }
  //유저이름으로 검색 즉 상점이름으로 검색하는 방법
  async findByUserId(user_id: string): Promise<UsedProduct[]> {
    return await this.usedProductRepository.find({
      where: { user: { id: user_id } },
      relations: [
        'user',
        'user.dong',
        'user.dong.sgng',
        'user.dong.sgng.sido',
        'like_user',
        'like_user.user',
        'post_images',
      ],
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
    return await this.usedProductRepository.find({
      where: searchConditions,
      relations: [
        'user',
        'user.dong',
        'user.dong.sgng',
        'user.dong.sgng.sido',
        'like_user',
        'like_user.user',
        'post_images',
      ],
    });
  }

  async create(
    user_id: string,
    createUsedProduct: CreateUsedProductInput,
  ): Promise<UsedProduct> {
    const { post_images, ...rest } = createUsedProduct;
    const user = await this.userService.findById(user_id);
    if (!user) {
      throw new Error('해당 사용자가 존재하지 않습니다');
    }

    const usedProduct = await this.usedProductRepository.save({
      user: user,
      create_at: new Date(),
      post_images: [],
      ...rest,
    });

    try {
      const files = await Promise.all(post_images);

      for (const file of files) {
        const url = await this.postImageService.saveImageToS3(
          this.imageFolder,
          file,
        );
        const postImage = await this.postImageService.createPostImage(
          url,
          null,
          null,
          null,
          usedProduct,
        );
        usedProduct.post_images.push(postImage);
      }
    } catch (error) {
      console.error('이미지 업로드 중 에러사유:', error);
      throw new BadRequestException('이미지 업로드에 에러 발생', error);
    }

    return await this.usedProductRepository.save(usedProduct);
  }

  async update(
    user_id: string,
    updateUsedProductInput: UpdateUsedProductInput,
  ): Promise<UsedProduct> {
    const { id, post_images, ...rest } = updateUsedProductInput;
    const usedProduct = await this.findById(id);
    if (!usedProduct) {
      throw new NotFoundException(`ID가 ${id}인 상품을 찾을 수 없습니다.`);
    }
    const user = await this.userService.findById(user_id);

    if (usedProduct.user.id !== user.id) {
      throw new ForbiddenException(
        `본인이 작성한 판매글만 수정할 수 있습니다.`,
      );
    }

    if (usedProduct.price !== rest.price) {
      const likes = await this.likeUserRecordService.findByUsedProductId(id);
      for (const like of likes) {
        await this.notificationService.create(like.id, '201');
      }
    }

    const files = await Promise.all(post_images);

    for (const file of files) {
      const url = await this.postImageService.saveImageToS3(
        this.imageFolder,
        file,
      );
      const postImage = await this.postImageService.createPostImage(
        url,
        null,
        null,
        null,
        usedProduct,
      );
      usedProduct.post_images.push(postImage);
    }

    const result = await this.usedProductRepository.update(
      { id: id },
      { ...usedProduct, ...rest },
    );

    return result.affected ? await this.findById(id) : null;
  }

  async delete(user_id: string, product_id: string): Promise<boolean> {
    const used_product = await this.findById(product_id);

    if (!used_product) {
      throw new NotFoundException(
        `ID가 ${product_id}인 상품을 찾을 수 없습니다.`,
      );
    }

    if (used_product.user.id !== user_id) {
      throw new ForbiddenException(
        `본인이 작성한 게시글만 삭제할 수 있습니다.`,
      );
    }

    for (const post_image of used_product.post_images) {
      await this.postImageService.deleteImageFromS3(post_image.imagePath);
    }

    const result = await this.usedProductRepository.delete(product_id);
    return result.affected ? true : false;
  }

  async addViewCount(product_id: string): Promise<UsedProduct> {
    const used_product = await this.findById(product_id);
    if (!used_product) {
      throw new NotFoundException(
        `ID가 ${product_id}인 상품을 찾을 수 없습니다.`,
      );
    }
    used_product.view = used_product.view + 1;

    return this.usedProductRepository.save(used_product);
  }

  async addLike(user_id: string, product_id: string): Promise<UsedProduct> {
    const used_product = await this.findById(product_id);
    const like_user_record = new LikeUserRecord();
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
    used_product.like_user.push(like_user_record);
    const like = await this.likeUserRecordRepository.save(like_user_record);
    await this.usedProductRepository.save(used_product);
    await this.notificationService.create(like.id, '200');
    return this.findById(product_id);
  }

  async deleteLike(user_id: string, product_id: string): Promise<UsedProduct> {
    const used_product = await this.findById(product_id);
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
    const likeIndex = used_product.like_user.findIndex(
      (Like_users) => Like_users.id === checkuser.id,
    );
    used_product.like_user.splice(likeIndex, 1);
    used_product.like = used_product.like - 1;

    await this.likeUserRecordRepository.delete(checkuser.id);
    await this.usedProductRepository.save(used_product);
    return this.findById(product_id);
  }
}
