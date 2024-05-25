import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostImage } from './entities/postImage.entity';
import { Repository } from 'typeorm';
import * as AWS from 'aws-sdk';
import { FileUpload } from 'graphql-upload';
import { Cook } from '../cooks/entities/cook.entity';
import { Board } from '../boards/entities/board.entity';
import { User } from '../users/entities/user.entity';
import { UsedProduct } from '../used_markets/entities/used_product.entity';

@Injectable()
export class PostImageService {
  private readonly awsS3: AWS.S3;
  private readonly S3_BUCKET_NAME: string;

  constructor(
    @InjectRepository(PostImage)
    private postImageRepository: Repository<PostImage>,
  ) {
    // AWS.config.update({
    //   logger: console,
    // });
    this.awsS3 = new AWS.S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET_KEY,
      region: process.env.AWS_S3_REGION,
    });
    this.S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
  }

  async saveImageToS3(folder: string, file: FileUpload): Promise<string> {
    try {
      const fileName = `${Date.now()}_${encodeURIComponent(
        file.filename,
      )}`.replace(/ /g, '');
      const key = `${folder}/${fileName}`;
      const uploadParams = {
        Bucket: this.S3_BUCKET_NAME,
        Key: key,
        Body: file.createReadStream(),
        ACL: 'public-read',
        ContentType: file.mimetype,
      };

      const result = await this.awsS3.upload(uploadParams).promise();

      return result.Location;
    } catch (error) {
      console.error('이미지 업로드 중 에러사유:', error);
      throw new Error('이미지 업로드에 에러 발생');
    }
  }

  async deleteImageFromS3(imageUrl: string): Promise<void> {
    try {
      const key = decodeURIComponent(
        imageUrl.split(
          `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/`,
        )[1],
      );

      // S3 객체 삭제 요청
      await this.awsS3
        .deleteObject({
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
        })
        .promise();
    } catch (error) {
      console.error('이미지 삭제 중 에러사유:', error);
      throw new Error('이미지 삭제에 에러 발생');
    }
  }

  async createPostImage(
    imagePath: string,
    cook?: Cook,
    board?: Board,
    user?: User,
    usedProduct?: UsedProduct,
  ) {
    return await this.postImageRepository.save({
      cook: cook,
      board: board,
      user: user,
      used_product: usedProduct,
      imagePath: imagePath,
    });
  }

  async removePostImage(id: string) {
    return await this.postImageRepository.delete({ id: id });
  }

  async newPostImage(
    imagePath: string,
    cook?: Cook,
    board?: Board,
    user?: User,
    usedProduct?: UsedProduct,
  ) {
    return this.postImageRepository.create({
      cook: cook,
      board: board,
      user: user,
      used_proudct: usedProduct,
      imagePath: imagePath,
    });
  }
}
