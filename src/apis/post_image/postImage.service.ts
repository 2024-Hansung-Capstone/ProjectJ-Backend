import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostImage } from './entities/postImage.entity';
import { Repository } from 'typeorm';
import * as AWS from 'aws-sdk';
import * as path from 'path';
import { FileUpload } from 'graphql-upload';
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

  async saveImageToS3(folder: string, file: FileUpload): Promise<string> {
    console.log(file);
    console.log(file.createReadStream);
    console.log(typeof file);
    try {
      const fileName = `${Date.now()}_${file.filename}`.replace(/ /g, ''); // 파일 이름 생성
      const key = `${folder}/${fileName}`; // S3에 저장할 파일 경로
      const uploadParams = {
        Bucket: this.S3_BUCKET_NAME,
        Key: key,
        Body: file.createReadStream(),
        ACL: 'public-read',
        ContentType: file.mimetype,
      };
      console.log(fileName);
      await this.awsS3.upload(uploadParams).promise();
      return fileName;
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
