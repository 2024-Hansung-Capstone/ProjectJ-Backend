import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { parseString } from 'xml2js';
import { OneRoom } from './entities/one_room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    var queryParams =
      '?' +
      encodeURIComponent('serviceKey') +
      '=OFnJLWtAPRyGRjRKBV%2FKNzwcpO20mUhwbUsVZrALLP%2FXOHQxpztDN0womM7gXTn9XPFHkLB%2BYMZBWxoQLN9CKA%3D%3D'; /* Service Key*/
    queryParams +=
      '&' + encodeURIComponent('LAWD_CD') + '=' + encodeURIComponent(LAWD_CD);
    queryParams +=
      '&' + encodeURIComponent('DEAL_YMD') + '=' + encodeURIComponent('201512');
    try {
      const response: any = this.httpService.get(apiUrl + '?' + queryParams);

      const xmlData: string = response.data;
      let jsonData: any;
      parseString(xmlData, (err: any, result: any) => {
        if (err) {
          throw new Error(`Failed to parse XML response: ${err.message}`);
        }
        jsonData = result;
      });
      const items: any[] = jsonData.response.item;
      const oneRooms: OneRoom[] = items.map((item) => {
        const oneRoom = new OneRoom();
        oneRoom.jibun = item.지번[0];
        oneRoom.monthly_rent = parseInt(item.월세금액[0]);
        oneRoom.area_exclusiveUse = parseFloat(item.전용면적[0]);
        return oneRoom;
      });

      await this.oneRoomRepository.save(oneRooms);
    } catch (error) {
      throw new Error(`OpenAPI로 데이터를 가져오지 못했음: ${error.message}`);
    }
    return;
  }
}
