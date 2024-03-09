import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
@Injectable()
export class OneRoomService {
  constructor(private readonly httpService: HttpService) {}

  async fetchOneRoomFromOpenAPI(
    LAWD_CD: string,
  ): Promise<Observable<AxiosResponse<any>>> {
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
    return this.httpService.get(apiUrl + queryParams);
  }
}
