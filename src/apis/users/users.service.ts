import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly areaService: AreaService,
    //private readonly notificationService: NotificationService,
    private readonly jwtService: JwtService,
  ) {}

  async create({ createUserInput }: IUserServiceCreate): Promise<User> {
    //이메일 기준으로 이미 가입되어있는 유저 찾기
    const existUser = await this.findByEmail(createUserInput.email);
    if (existUser != null) {
      throw new BadRequestException('이미 가입된 사용자입니다.');
    }

    //토큰 인증이 완료가 되어 있는지 확인
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

    const { birth_year, birth_month, birth_day, password, dong_nm, ...rest } =
      createUserInput;
    //inputUser dto에서 엔티티와의 형태가 다른 생년월일 관련 값만 따로 변수로 가져오고,
    //나머지는 rest로 저장한다.(웹워크1 때 배움)
    const birthDate = setDateFormat(birth_year, birth_month, birth_day);

    //bcrypt: hash를 도와주는 패키지
    //hash(password, salt)
    const hashedPassword = await bcrypt.hash(password, 10);

    //행정동 데이터 불러오기
    const dong = await this.areaService.findDongByName(dong_nm);

    //date 타입으로 연산한 birthDate를 데이터베이스의 birth_at 컬럼으로 넣어주고,
    //나머지는 받은 그대로 rest로 저장한다.
    const newUser = await this.userRepository.save({
      birth_at: birthDate,
      password: hashedPassword,
      dong: dong,
      ...rest,
    }); //스프레드 연산자를 통해 한번에 값을 넣음.(웹워크1 때 배움)

    //Token에 user 정보 업데이트 해주기
    await this.tokenRepository.update(
      { phone_number: createUserInput.phone_number },
      { user: newUser },
    );

    //await this.notificationService.create(newUser.id, '100');

    return await this.userRepository.findOne({
      where: { id: newUser.id },
      relations: ['dong', 'dong.sgng', 'dong.sgng.sido'],
    });
  }

  //회원 정보 수정
  //id값은 context를 통해 로그인 된 사용자의 id를 가져올거라서 사용자의 입력값과 분리해서 인자값으로 받음.
  async update(
    user_id: string,
    { updateUserInput }: IUserServiceUpdate,
  ): Promise<User> {
    const { birth_year, birth_month, birth_day, ...rest } = updateUserInput;
    let result = null;
    //날짜에 대한 수정이 들어오면, date타입으로 전환하는 메커니즘을 실행한 후, update를 진행
    if (birth_year && birth_month && birth_day) {
      const birthDate = setDateFormat(birth_year, birth_month, birth_day);
      result = await this.userRepository.update(
        { id: user_id },
        { birth_at: birthDate, ...rest },
      );
    }
    //날짜에 대한 수정이 없을 때, 날짜 변환 없이 전부 update 진행
    else {
      result = await this.userRepository.update({ id: user_id }, { ...rest });
    }
    //수정 성공
    if (result.affected > 0) {
      return await this.findById(user_id);
    }
    //수정 실패
    else {
      return null;
    }
  }

  //회원 정보 삭제
  //레포지토리를 delete 할 때는 boolean 타입이 아니라 DeleteResult 타입으로 리턴된다.
  async delete(user_id: string): Promise<boolean> {
    const result = await this.userRepository.delete({ id: user_id });
    return result.affected > 0; //DeleteResult 타입 안의 affected는 성공했을 때 1, 실패했을 때 0을 리턴
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['dong', 'dong.sgng', 'dong.sgng.sido'],
    });
  }

  async findById(user_id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['dong', 'dong.sgng', 'dong.sgng.sido'],
    });
    //fineOne은 값을 찾는 여러 가지 기준이 있는데, 그 중에서 같은 값을 매칭해서 찾는게 where이다.
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email: email },
      relations: ['dong', 'dong.sgng', 'dong.sgng.sido'],
    });
  }

  async createToken(phone_number: string): Promise<string> {
    try {
      //랜덤한 6자리 숫자 토큰 생성, 빈 자리는 0으로 채워줌.
      const token = String(Math.floor(Math.random() * 1000000)).padStart(
        6,
        '0',
      );

      //이미 인증번호를 받은 휴대폰인지 확인
      const existingToken = await this.tokenRepository.findOneBy({
        phone_number,
      });

      //인증번호를 이미 받은 휴대폰인 경우
      if (existingToken) {
        //토큰값은 새로 만든 토큰으로 넣어주고, 인증은 되지 않은 상태로 만든 후, 데이터베이스에 업데이트해줌.
        existingToken.token = token;
        existingToken.is_auth = false;
        await this.tokenRepository.save(existingToken);
      } else {
        await this.tokenRepository.save({
          phone_number: phone_number,
          token: token,
        });
      }
      sendTokenToSMS(phone_number, token);
      return token;
    } catch (error) {
      throw new BadRequestException('Token 생성에 실패하였습니다.');
    }
  }

  async checkToken(phone_number: string, token: string): Promise<boolean> {
    try {
      //데이터베이스에 존재하는 올바른 토큰 찾기
      const rightToken = (
        await this.tokenRepository.findOne({
          where: { phone_number: phone_number },
        })
      ).token;
      //올바른 토큰과 사용자가 입력한 토큰이 같으면 true, 다르면 false
      const checkResult = rightToken === token;
      //update: 이미 존재하는 데이터를 특정 값만 변경하는 기능
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

  //JWT Token 생성=>로그인을 위함
  //JWT Token은 만들어지면 string 타입이다.(리턴 타입: string)
  getAccessToken(user: User | IUserContext['user']): string {
    return this.jwtService.sign(
      { sub: user.id },
      { secret: 'sujin', expiresIn: '10m' },
    );
  }

  //AccessToken을 재생성해주는 RefreshToken 생성
  //=>유효기간이 짧은 AccessToken을 자동으로 생성하는 기능을 구현하기 위한 Token
  //자동 생성 이유: AccessToken만 하면 사용자가 10분에 한 번 씩 로그인을 해야 해서
  //cookie에만 저장하면 되는거라 리턴 타입은 void(없다는 뜻)
  getRefreshToken(user: User, context: IContext): void {
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: 'sujin2', expiresIn: '2w' },
    );

    //cookie에 저장하는거
    context.res.setHeader(
      'set-cookie',
      `refreshToken=${refreshToken}; path=/;`,
    );
  }

  getRestoreToken(user: IUserContext['user']): string {
    return this.getAccessToken(user);
  }
}
