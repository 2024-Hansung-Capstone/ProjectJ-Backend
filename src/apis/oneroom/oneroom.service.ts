import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { OneRoom } from './entities/one_room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchOneRoomInput } from './dto/serach-oneRoom.input';
@Injectable()
export class OneRoomService {
  constructor(
    @InjectRepository(OneRoom)
    private readonly oneRoomRepository: Repository<OneRoom>,
    private readonly httpService: HttpService,
  ) {}

  async fetchOneRoomDataForEachDistrict(): Promise<void> {
    const districts = [
      { name: '종로구', LAWD_CD: '11110' },
      { name: '중구', LAWD_CD: '11140' },
      { name: '용산구', LAWD_CD: '11170' },
      { name: '성동구', LAWD_CD: '11200' },
      { name: '광진구', LAWD_CD: '11215' },
      { name: '동대문구', LAWD_CD: '11230' },
      { name: '중랑구', LAWD_CD: '11260' },
      { name: '성북구', LAWD_CD: '11290' },
      { name: '강북구', LAWD_CD: '11305' },
      { name: '도봉구', LAWD_CD: '11320' },
      { name: '노원구', LAWD_CD: '11350' },
      { name: '은평구', LAWD_CD: '11380' },
      { name: '서대문구', LAWD_CD: '11410' },
      { name: '마포구', LAWD_CD: '11440' },
      { name: '양천구', LAWD_CD: '11470' },
      { name: '강서구', LAWD_CD: '11500' },
      { name: '구로구', LAWD_CD: '11530' },
      { name: '금천구', LAWD_CD: '11545' },
      { name: '영등포구', LAWD_CD: '11560' },
      { name: '동작구', LAWD_CD: '11590' },
      { name: '관악구', LAWD_CD: '11620' },
      { name: '서초구', LAWD_CD: '11650' },
      { name: '강남구', LAWD_CD: '11680' },
      { name: '송파구', LAWD_CD: '11710' },
      { name: '강동구', LAWD_CD: '11740' },
    ];

    for (const district of districts) {
      await this.fetchOneRoomFromOpenAPI(district.LAWD_CD);
    }
  }

  async fetchOneRoomFromOpenAPI(LAWD_CD: string): Promise<void> {
    const apiUrl =
      'http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcRHRent';
    const queryParams =
      '?' +
      encodeURIComponent('serviceKey') +
      '=OFnJLWtAPRyGRjRKBV%2FKNzwcpO20mUhwbUsVZrALLP%2FXOHQxpztDN0womM7gXTn9XPFHkLB%2BYMZBWxoQLN9CKA%3D%3D' +
      '&' +
      encodeURIComponent('LAWD_CD') +
      '=' +
      encodeURIComponent(LAWD_CD) +
      '&' +
      encodeURIComponent('DEAL_YMD') +
      '=' +
      encodeURIComponent('201512');

    try {
      const response = await this.httpService
        .get(apiUrl + queryParams)
        .toPromise();
      const jsonData = response.data;

      const items = jsonData.response.body.items || {};
      const itemsArray: any[] = Object.values(items);
      for (const items of itemsArray) {
        for (const item of items) {
          console.log(item);
          const existingOneRoom = await this.oneRoomRepository.findOne({
            where: {
              name: item['연립다세대'],
              area_exclusiveUse: isNaN(parseFloat(item['전용면적']))
                ? 0
                : parseFloat(item['전용면적']),
            },
          });
          if (!existingOneRoom) {
            const oneRoom = new OneRoom();
            const monthlyRent = isNaN(parseInt(item['월세금액']))
              ? 0
              : parseInt(item['월세금액']);
            var deposit = isNaN(parseFloat(item['보증금액']))
              ? 0
              : parseFloat(item['보증금액']);
            if (deposit >= 100) deposit /= 1000; // openapi에서 보증금이 백만원인 원룸은 100 천만원인 원룸은 1.000이렇게 저장되어 있어서 이것을 고치기 위해사용
            var is_monthly_rent: boolean = false;
            if (monthlyRent !== 0) is_monthly_rent = true;
            const areaExclusiveUse = isNaN(parseFloat(item['전용면적']))
              ? 0
              : parseFloat(item['전용면적']);
            oneRoom.jibun = item['지번'];
            oneRoom.name = item['연립다세대'];
            oneRoom.dong = item['법정동'];
            oneRoom.monthly_rent = monthlyRent;
            oneRoom.area_exclusiveUse = areaExclusiveUse;
            oneRoom.is_monthly_rent = is_monthly_rent;
            oneRoom.deposit = deposit;
            await this.oneRoomRepository.save(oneRoom);
          }
        }
      }
    } catch (error) {
      throw new Error(
        `OneRoomAPI로 데이터를 가져오지 못했음: ${error.message}`,
      );
    }
  }
  async findAll(): Promise<OneRoom[]> {
    return await this.oneRoomRepository.find();
  }
  async fetchOneRoomByXY(
    StartX: number,
    StartY: number,
    EndX: number,
    EndY: number,
  ) {
    const geoCoderApiUrl = 'https://api.vworld.kr/req/address';
    const apiKey = '26F627EA-4AEA-3C79-A2D8-9C1911AC03B7';
    const OneRooms = await this.findAll();
    let InOneRooms: OneRoom[] = [];
    var count = 0;
    for (const room of OneRooms) {
      count++;
      const queryParams = `?service=address&request=getcoord&version=2.0&crs=epsg:4326&address=${encodeURIComponent(
        `${room.dong} ${room.jibun}`,
      )}&refine=true&simple=false&format=json&type=parcel&key=${encodeURIComponent(
        apiKey,
      )}`;
      const response = await this.httpService
        .get(geoCoderApiUrl + queryParams)
        .toPromise();
      const jsonData = response.data;
      let xValue: number;
      let yValue: number;
      xValue = 0;
      yValue = 0;

      if (
        jsonData &&
        jsonData.response &&
        jsonData.response.result &&
        jsonData.response.result.point
      ) {
        xValue = parseFloat(jsonData.response.result.point.x);
        yValue = parseFloat(jsonData.response.result.point.y);
      } else {
        console.log('sorry');
        continue;
      }
      console.log(room.dong, room.jibun, xValue, yValue, count);
      if (
        StartX <= xValue &&
        xValue <= EndX &&
        StartY <= yValue &&
        yValue <= EndY
      )
        InOneRooms.push(room);
    }
    return InOneRooms;
  }

  async findBySerach(searchPostDto: SearchOneRoomInput): Promise<OneRoom[]> {
    const {
      jibun,
      maxmonthly_rent,
      minmonthly_rent,
      maxarea_exclusiveUse,
      minarea_exclusiveUse,
      name,
      dong,
      is_monthly_rent,
      maxdeposit,
      mindeposit,
    } = searchPostDto;
    const searchConditions: any = {};
    if (jibun) {
      searchConditions.jibun = jibun;
    }
    if (is_monthly_rent) {
      searchConditions.is_monthly_rent = is_monthly_rent;
    }
    if (maxdeposit !== undefined || mindeposit !== undefined) {
      searchConditions.monthly_rent = {};

      if (mindeposit !== undefined) {
        searchConditions.monthly_rent.gte = mindeposit;
      }

      if (maxdeposit !== undefined) {
        searchConditions.monthly_rent.lte = maxdeposit;
      }
    }
    if (maxmonthly_rent !== undefined || minmonthly_rent !== undefined) {
      searchConditions.monthly_rent = {};

      if (minmonthly_rent !== undefined) {
        searchConditions.monthly_rent.gte = minmonthly_rent;
      }

      if (maxmonthly_rent !== undefined) {
        searchConditions.monthly_rent.lte = maxmonthly_rent;
      }
    }

    if (
      minarea_exclusiveUse !== undefined ||
      maxarea_exclusiveUse !== undefined
    ) {
      searchConditions.area_exclusiveUse = {};

      if (minarea_exclusiveUse !== undefined) {
        searchConditions.area_exclusiveUse.gte = minarea_exclusiveUse;
      }

      if (maxarea_exclusiveUse !== undefined) {
        searchConditions.area_exclusiveUse.lte = maxarea_exclusiveUse;
      }
    }
    if (name) {
      searchConditions.name = name;
    }
    if (dong) {
      searchConditions.dong = dong;
    }
    return await this.oneRoomRepository.find({ where: searchConditions });
  }
}
