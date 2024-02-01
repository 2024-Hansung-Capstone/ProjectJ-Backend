import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserServiceCreate } from './interfaces/user-service.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create({ createUserInput }: IUserServiceCreate): Promise<User> {
    const { birth_year, birth_month, birth_day, ...rest } = createUserInput;
    //inputUser dto에서 엔티티와의 형태가 다른 생년월일 관련 값만 따로 변수로 가져오고,
    //나머지는 rest로 저장한다.(웹워크1 때 배움)

    const birthDateString = `${birth_year}-${birth_month.padStart(
      2,
      '0',
    )}-${birth_day.padStart(2, '0')}T00:00:00.000Z`;
    const birthDate = new Date(birthDateString);

    //date 타입으로 연산한 birthDate를 데이터베이스의 birth_at 컬럼으로 넣어주고,
    //나머지는 받은 그대로 rest로 저장한다.
    return await this.userRepository.save({ birth_at: birthDate, ...rest }); //스프레드 연산자를 통해 한번에 값을 넣음.(웹워크1 때 배움)
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(user_id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id: user_id } });
    //fineOne은 값을 찾는 여러 가지 기준이 있는데, 그 중에서 같은 값을 매칭해서 찾는게 where이다.
  }
}
