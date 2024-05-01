import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostImage } from './entities/postImage.entity';
import { Repository } from 'typeorm';
import * as AWS from 'aws-sdk';
import * as path from 'path';

@Injectable()
export class PostImageService {
  private readonly awsS3: AWS.S3;
  private readonly S3_BUCKET_NAME: string;

  constructor(
    @InjectRepository(PostImage)
    private PostImageRepository: Repository<PostImage>,
  ) {
    this.awsS3 = new AWS.S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET_KEY,
      region: process.env.AWS_S3_REGION,
    });
    this.S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
  }

  async saveImageToS3(
    folder: string,
    file: Express.Multer.File | Express.Multer.File[],
  ): Promise<string | string[]> {
    try {
      // 입력값이 파일 배열인 경우와 단일 파일인 경우를 구분하여 처리
      if (Array.isArray(file)) {
        const uploadedUrls: string[] = [];

        for (const singleFile of file) {
          const key = `${folder}/${Date.now()}_${path.basename(
            singleFile.originalname,
          )}`.replace(/ /g, '');

          await this.awsS3
            .putObject({
              Bucket: this.S3_BUCKET_NAME,
              Key: key,
              Body: singleFile.buffer,
              ACL: 'public-read',
              ContentType: singleFile.mimetype,
            })
            .promise();

          const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
          uploadedUrls.push(imageUrl);
        }

        return uploadedUrls;
      } else {
        const key = `${folder}/${Date.now()}_${path.basename(
          file.originalname,
        )}`.replace(/ /g, '');

        await this.awsS3
          .putObject({
            Bucket: this.S3_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ACL: 'public-read',
            ContentType: file.mimetype,
          })
          .promise();

        return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
      }
    } catch (error) {
      console.error('이미지 업로드 중 에러사유:', error);
      throw new Error('이미지 업로드에 에러 발생');
    }
  }

  async deleteImageFromS3(imageUrl: string): Promise<void> {
    try {
      // 이미지 URL에서 키(Key)를 추출
      const key = imageUrl.split(
        `${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/`,
      )[1];

      // S3 객체 삭제 요청
      await this.awsS3
        .deleteObject({
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
        })
        .promise();

      console.log(`이미지 (${imageUrl}) 삭제 완료`);
    } catch (error) {
      console.error('이미지 삭제 중 에러사유:', error);
      throw new Error('이미지 삭제에 에러 발생');
    }
  }
}
