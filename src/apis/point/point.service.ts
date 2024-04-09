import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyCheck } from './entity/dailyCheck.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/users.service';
import { Role } from './entity/role.entity';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(DailyCheck)
    private readonly dailyCheckRepository: Repository<DailyCheck>,
    private readonly userService: UserService,
  ) {}

  /**
   * 포인트 증가 서비스 메서드
   * @param user_id 사용자 ID
   * @param point 증가할 포인트
   * @returns 포인트가 증가된 사용자 정보
   */
  async increase(user_id: string, point: number): Promise<User> {
    const user = await this.userService.findById(user_id);
    if (!user) {
      throw new Error('해당 사용자가 존재하지 않습니다');
    }

    const role = await this.findRoleByUserId(user_id);
    if (role.code == 'admin') {
      throw new Error('관리자는 포인트를 증가시킬 수 없습니다');
    }

    await this.userRepository.update(user_id, { point: user.point + point });
    return user;
  }

  /**
   * 사용자의 포인트에 따른 역할 정보 조회 서비스 메서드
   * @param user_id 조회할 사용자 ID
   * @returns 사용자의 포인트에 따른 역할 정보
   */
  async findRoleByUserId(user_id: string): Promise<Role> {
    const user = await this.userService.findById(user_id);
    if (!user) {
      throw new Error('해당 사용자가 존재하지 않습니다');
    }

    const role = await this.roleRepository.findOne({
      where: {
        min_point: LessThanOrEqual(user.point),
        max_point: MoreThanOrEqual(user.point),
      },
    });

    return role;
  }

  /**
   * 출석 체크 서비스 메서드
   * 이미 출석한 경우 실패 처리
   * @param user_id 사용자 ID
   * @returns 출석 체크 성공 여부
   */
  async checkIn(user_id: string): Promise<boolean> {
    const user = await this.userService.findById(user_id);
    if (!user) {
      throw new Error('해당 사용자가 존재하지 않습니다');
    }

    // 오늘 날짜 구하기
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const formattedDate = `${year}-${month}-${date}`;
    const startOfDay = new Date(formattedDate);

    const latestCheckedAt = await this.dailyCheckRepository.find({
      where: { user: { id: user_id } },
      order: { checked_at: 'DESC' },
      take: 1,
    });

    if (latestCheckedAt.length === 0) {
      await this.dailyCheckRepository.save({
        user: user,
        checked_at: startOfDay,
      });

      await this.increase(user_id, 50);

      return true;
    }

    if (latestCheckedAt[0].checked_at >= startOfDay) {
      throw new Error('이미 출석했습니다');
    }

    await this.dailyCheckRepository.save({
      user: user,
      checked_at: startOfDay,
    });

    await this.increase(user_id, 50);

    return true;
  }
}
