import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point } from './entity/point.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
  ) {}

  async findById(id: string): Promise<Point> {
    return await this.pointRepository.findOne({
      where: { id: id },
    });
  }

  async increasePoint(id: string, additionalPoint: number): Promise<Point> {
    const point = await this.findById(id);
    var n: number = 1;
    if (!point) {
      throw new Error('Point가 존재하지 않습니다');
    }
    point.value = point.value + additionalPoint;

    await this.pointRepository.save(point);
    await this.checkTitleByPoint(id);
    return point;
  }

  async checkTitleByPoint(id: string): Promise<void> {
    const point = await this.findById(id);
    if (!point) {
      throw new Error('Point가 존재하지 않습니다');
    }
    if (point.value >= 0 && point.value <= 1000) point.title = '자취어린이';
    else if (point.value >= 1001 && point.value <= 2000)
      point.title = '초보자취생';
    else if (point.value >= 2001 && point.value <= 3000)
      point.title = 'N년차자취생';
    else if (point.value >= 3001 && point.value <= 4000)
      point.title = '자취도사';
    else point.title = '자취만렙';
    await this.pointRepository.save(point);
  }

  async checkAttendance(id: string): Promise<boolean> {
    const point = await this.findById(id);
    if (!point) {
      throw new Error('Point가 존재하지 않습니다');
    }

    // 오늘 날짜 구하기
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const formattedDate = `${year}-${month}-${date}`;
    const startOfDay = new Date(formattedDate);

    if (!point.attendanceDates) {
      point.attendanceDates = [];
    }
    const isAlreadyChecked = point.attendanceDates.some((attendanceDate) => {
      // date를 Date 객체로 형변환하여 연도, 월, 일이 같은지 비교
      const checkDate = new Date(attendanceDate);
      return (
        checkDate.getFullYear() === year &&
        checkDate.getMonth() === today.getMonth() &&
        checkDate.getDate() === date
      );
    });

    if (isAlreadyChecked) {
      return false;
    }

    point.attendanceDates.push(startOfDay);
    await this.pointRepository.save(point);
    await this.increasePoint(id, 50);

    return true;
  }
}
