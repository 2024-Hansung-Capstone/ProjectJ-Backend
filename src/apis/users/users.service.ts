import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IContext,
  IUserContext,
  IUserServiceCreate,
  IUserServiceUpdate,
} from './interfaces/user-service.interface';
import * as bcrypt from 'bcrypt';
import { Token } from './entities/token.entity';
import { sendTokenToSMS } from '../../utils/phone';
import { JwtService } from '@nestjs/jwt';
import { setDateFormat } from 'src/utils/date';
import { AreaService } from '../area/area.service';
import { NotificationService } from '../notifications/notifications.service';
import { PointService } from '../point/point.service';
import { PostImageService } from '../post_image/postImage.service';

@Injectable()
export class UserService {
  private imageFolder = 'user';
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly areaService: AreaService,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
    private readonly pointService: PointService,
    private readonly postImageService: PostImageService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 사용자 추가 서비스 메서드
   * 중복된 email, 휴대폰 인증 여부 확인 후 회원가입 진행
   * @param createUserInput 사용자 회원가입 페이지 입력값
   * @returns 회원가입 완료된 사용자 정보
   */
  async create({ createUserInput }: IUserServiceCreate): Promise<User> {
    // 이메일 중복 확인
    const existUser = await this.findByEmail(createUserInput.email);
    if (existUser != null) {
      throw new BadRequestException('이미 가입된 사용자입니다.');
    }

    // 토큰 인증이 완료가 되어 있는지 확인
    const myToken = await this.tokenRepository.findOne({
      where: { phone_number: createUserInput.phone_number },
    });
    if (!myToken) {
      throw new BadRequestException(
        '아직 휴대폰 인증이 되지 않은 사용자 입니다.',
      );
    }
    if (myToken.is_auth == false) {
      throw new BadRequestException(
        '아직 휴대폰 인증이 되지 않은 사용자 입니다.',
      );
    }

    const {
      birth_year,
      birth_month,
      birth_day,
      password,
      dong_code,
      profile_image,
      ...rest
    } = createUserInput;
    const birthDate = setDateFormat(birth_year, birth_month, birth_day);
    const hashedPassword = await bcrypt.hash(password, 10);
    const dong = await this.areaService.findDongByCode(dong_code);

    const user = await this.userRepository.save({
      birth_at: birthDate,
      password: hashedPassword,
      dong: dong,
      ...rest,
    });

    if (profile_image) {
      const url = await this.postImageService.saveImageToS3(
        this.imageFolder,
        await profile_image,
      );
      const postImage = await this.postImageService.createPostImage(
        url,
        undefined,
        undefined,
        user,
      );
      await this.userRepository.update(
        { id: user.id },
        { profile_image: postImage },
      );
    }

    // Token에 user 정보 업데이트
    await this.tokenRepository.update(
      { phone_number: createUserInput.phone_number },
      { user: user },
    );

    // 회원 가입 알림 생성
    await this.notificationService.create(user.id, '100');

    //포인트 적립
    await this.pointService.increase(user.id, 300);

    return await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['dong', 'dong.sgng', 'dong.sgng.sido', 'profile_image'],
    });
  }

  /**
   * 사용자 정보 수정 서비스 메서드
   * @param user_id 사용자 고유 ID
   * @param updateUserInput 사용자 정보 수정 페이지 입력값
   * @returns 수정된 사용자 정보
   */
  async update(
    user_id: string,
    { updateUserInput }: IUserServiceUpdate,
  ): Promise<User> {
    const user = await this.findById(user_id);
    const { birth_year, birth_month, birth_day, profile_image, ...rest } =
      updateUserInput;

    //비밀번호 hash
    if (rest.password) {
      const hashedPassword = await bcrypt.hash(rest.password, 10);
      rest.password = hashedPassword;
    }
    let result = null;

    if (profile_image) {
      await this.postImageService.deleteImageFromS3(
        user.profile_image.imagePath,
      );
      await this.postImageService.removePostImage(user.profile_image.id);

      const url = await this.postImageService.saveImageToS3(
        this.imageFolder,
        await profile_image,
      );
      const postImage = await this.postImageService.createPostImage(
        url,
        undefined,
        undefined,
        user,
      );
      user.profile_image = postImage;
    }

    // 날짜에 대한 수정이 들어오면, date타입으로 전환하는 메커니즘을 실행한 후, update를 진행
    if (birth_year && birth_month && birth_day) {
      const birthDate = setDateFormat(birth_year, birth_month, birth_day);
      result = await this.userRepository.update(
        { id: user_id },
        { birth_at: birthDate, profile_image: user.profile_image, ...rest },
      );
    }
    // 날짜에 대한 수정이 없을 때, 날짜 변환 없이 전부 update 진행
    else {
      result = await this.userRepository.update(
        { id: user_id },
        { profile_image: user.profile_image, ...rest },
      );
    }

    if (result.affected > 0) {
      return await this.findById(user_id);
    } else {
      return null;
    }
  }

  /**
   * 사용자 삭제 서비스 메서드
   * @param user_id 사용자 고유 ID
   * @returns 사용자 삭제 성공 여부
   */
  async delete(user_id: string): Promise<boolean> {
    const user = await this.findById(user_id);
    if (user.profile_image) {
      await this.postImageService.deleteImageFromS3(
        user.profile_image.imagePath,
      );
    }

    const result = await this.userRepository.delete({ id: user_id });
    return result.affected > 0;
  }

  /**
   * 전체 사용자 정보 조회 서비스 메서드
   * @returns 전체 사용자 정보
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['dong', 'dong.sgng', 'dong.sgng.sido', 'profile_image'],
    });
  }

  /**
   * 고유ID를 통한 사용자 정보 조회 서비스 메서드
   * @param user_id 사용자 고유 ID
   * @returns 특정 사용자 정보
   */
  async findById(user_id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['dong', 'dong.sgng', 'dong.sgng.sido', 'profile_image'],
    });
  }

  /**
   * 이메일을 통한 사용자 정보 조회 서비스 메서드
   * @param email 사용자 이메일
   * @returns 특정 사용자 정보
   */
  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email: email },
      relations: ['dong', 'dong.sgng', 'dong.sgng.sido', 'profile_image'],
    });
  }

  /**
   * 핸드폰 본인 인증 번호 생성 서비스 메서드
   * 6자리 토큰 생성 후, SMS로 전송
   * @param phone_number 사용자 휴대폰 번호
   * @returns 6자리 토큰 번호
   */
  async createToken(phone_number: string): Promise<string> {
    try {
      const token = String(Math.floor(Math.random() * 1000000)).padStart(
        6,
        '0',
      );

      const existingToken = await this.tokenRepository.findOneBy({
        phone_number,
      });
      // 이미 인증번호를 받은 휴대폰인 경우 새로 만든 토큰으로 넣어주고, 인증은 되지 않은 상태로 업데이트
      if (existingToken) {
        existingToken.token = token;
        existingToken.is_auth = false;
        await this.tokenRepository.save(existingToken);
      }
      // 인증번호를 받지 않은 휴대폰인 경우 새로운 데이터 생성
      else {
        await this.tokenRepository.save({
          phone_number: phone_number,
          token: token,
        });
      }

      // SMS로 토큰 전송
      await sendTokenToSMS(phone_number, token);
      return token;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Token 생성에 실패하였습니다.');
    }
  }

  /**
   * 핸드폰 본인 인증 서비스 메서드
   * 휴대폰 번호로 보내진 인증번호 일치 여부 확인
   * @param phone_number 사용자 휴대폰 번호
   * @param token 사용자가 입력한 인증번호
   * @returns 인증 성공 여부
   */
  async checkToken(phone_number: string, token: string): Promise<boolean> {
    try {
      const rightToken = (
        await this.tokenRepository.findOne({
          where: { phone_number: phone_number },
        })
      ).token;
      const checkResult = rightToken === token;
      await this.tokenRepository.update(
        { phone_number: phone_number },
        { is_auth: checkResult },
      );
      return checkResult;
    } catch (error) {
      throw new UnauthorizedException(
        '인증번호를 받지 않은 휴대폰 번호 입니다.',
      );
    }
  }

  /**
   * JWT 토큰 생성 서비스 메서드
   * @param email 사용자 이메일
   * @param password 사용자 비밀번호
   * @returns accessToken
   */
  getAccessToken(user: User | IUserContext['user']): string {
    return this.jwtService.sign(
      { sub: user.id },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '100m' },
    );
  }

  /**
   * JWT 토큰 만료 대비 refresh 토큰 생성 서비스 메서드
   * @param user 사용자 정보
   * @param context context
   */
  getRefreshToken(user: User, context: IContext): void {
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '2w' },
    );

    context.res.setHeader(
      'set-cookie',
      `refreshToken=${refreshToken}; path=/;`,
    );
  }

  /**
   * JWT 토큰 재발급 서비스 메서드
   * @param token JWT 토큰
   * @returns 사용자 정보
   */
  getRestoreToken(user: IUserContext['user']): string {
    return this.getAccessToken(user);
  }

  /**
   * 테스트용 토큰 생성 서비스 메서드
   * 토큰 생성과 함께 인증 완료 상태로 업데이트
   * @param phone_number 사용자 휴대폰 번호
   * @returns 6자리 토큰 번호
   */
  async createTestToken(phone_number: string): Promise<string> {
    try {
      const token = String(Math.floor(Math.random() * 1000000)).padStart(
        6,
        '0',
      );

      const existingToken = await this.tokenRepository.findOneBy({
        phone_number,
      });

      if (existingToken) {
        existingToken.token = token;
        existingToken.is_auth = true;
        await this.tokenRepository.save(existingToken);
      } else {
        await this.tokenRepository.save({
          phone_number: phone_number,
          token: token,
          is_auth: true,
        });
      }
      return token;
    } catch (error) {
      throw new BadRequestException('Token 생성에 실패하였습니다.');
    }
  }
}
