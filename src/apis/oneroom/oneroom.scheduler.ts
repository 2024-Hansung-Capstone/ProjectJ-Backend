import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OneRoomService } from './oneroom.service';

@Injectable()
export class OneRoomScheduler {
  constructor(private readonly OneRoomService: OneRoomService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async fetchDateFromOpenAPT(): Promise<void> {
    try {
      await this.OneRoomService;
      console.log('데이터를 성공적으로 가져왔습니다');
    } catch (error) {
      console.error('데이터를 가져오지 못했습니다');
    }
  }
}
