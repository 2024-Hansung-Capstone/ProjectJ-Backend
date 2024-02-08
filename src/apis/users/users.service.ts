import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserServiceCreate } from './interfaces/user-service.interface';
import * as bcrypt from 'bcrypt';
import { Token } from './entities/token.entity';
import { sendTokenToSMS } from '../../utils/phone';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
  ) {}

  async create({ createUserInput }: IUserServiceCreate): Promise<User> {
    //이메일 기준으로 이미 가입되어있는 유저 찾기
    const existUser = await this.findByEmail(createUserInput.email);
    if (existUser != null) {
      throw new BadRequestException('이미 가입된 사용자입니다.');
    }

    const { birth_year, birth_month, birth_day, password, ...rest } =
      createUserInput;
    //inputUser dto에서 엔티티와의 형태가 다른 생년월일 관련 값만 따로 변수로 가져오고,
    //나머지는 rest로 저장한다.(웹워크1 때 배움)

    const birthDateString = `${birth_year}-${birth_month.padStart(
      2,
      '0',
    )}-${birth_day.padStart(2, '0')}T00:00:00.000Z`;
    const birthDate = new Date(birthDateString);

    //bcrypt: hash를 도와주는 패키지
    //hash(password, salt)
    const hashedPassword = await bcrypt.hash(password, 10);

    //date 타입으로 연산한 birthDate를 데이터베이스의 birth_at 컬럼으로 넣어주고,
    //나머지는 받은 그대로 rest로 저장한다.
    return await this.userRepository.save({
      birth_at: birthDate,
      password: hashedPassword,
      ...rest,
    }); //스프레드 연산자를 통해 한번에 값을 넣음.(웹워크1 때 배움)
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(user_id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id: user_id } });
    //fineOne은 값을 찾는 여러 가지 기준이 있는데, 그 중에서 같은 값을 매칭해서 찾는게 where이다.
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email: email } });
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
  getAccessToken(user: User) {
    return this.jwtService.sign(
      { sub: user.id },
      { secret: 'sujin', expiresIn: '10m' },
    );
  }
}
