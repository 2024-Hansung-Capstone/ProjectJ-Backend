![header](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=10&height=200&text=ProjectJ-Backend&fontSize=50&animation=twinkling&fontAlign=68&fontAlignY=36)
## 정의
﻿자취생들의 편의를 위한 사이트인 “자취만렙”에서 필요한 기능을 구현한 API 백엔드 서버이다.
NestJS 프레임워크에서 GraphQL 쿼리 언어를 사용하여 개발 완료 후 Docker를 통해 패키징 하였다.
현재, AWS EC2 인스턴스를 통해 배포 중이다.


## ﻿설치
﻿1) 환경변수 설정
    가. .env 설정
JWT_ACCESS_SECRET = (사용자 관리 중 JWT의 Access키 생성을 위한 암호)
JWT_REFRESH_SECRET = (사용자 관리 중 JWT의 Refresh키 생성을 위한 암호)

SMS_KEY = (CoolSMS API 인증키)
SMS_SECRET = (CoolSMS API 암호키)
SMS_SENDER = (문자 메시지 전달할 휴대폰 번호)

SERVER_INTERNAL_PORT = (서버 포트포워딩에서 내부 포트)
SERVER_EXTERNAL_PORT = (서버 포트포워딩에서 외부 포트)

DATABASE_TYPE = (메인으로 사용할 데이터베이스의 종류 ex)mysql)
DATABASE_HOST = (데이터베이스 host 주소)
DATABASE_INTERNAL_PORT = (데이터베이스 포트포워딩에서 내부 포트)
DATABASE_EXTERNAL_PORT = (데이터베이스 포트포워딩에서 외부 포트)
DATABASE_USERNAME = (데이터베이스 사용자명)
DATABASE_PASSWORD = (데이터베이스 암호)
DATABASE_DATABASE = (데이터베이스 스키마명)

OPENAI_SECRET = (OPENAI API 비밀 키)

나. .env.docker 설정
DATABASE_TYPE = (메인으로 사용할 데이터베이스의 종류 ex)mysql)
DATABASE_HOST = (데이터베이스 host 주소)
DATABASE_PORT= (데이터베이스 포트)
DATABASE_USERNAME = (데이터베이스 사용자명)
DATABASE_PASSWORD = (데이터베이스 암호)
DATABASE_DATABASE = (데이터베이스 스키마명)

2) 프로젝트 파일 설치
    git clone https://github.com/2024-Hansung-Capstone/ProjectJ-Backend.git

3) Docker
    docker-compose build
    docker-compose up
     -백그라운드에서 실행: docker-compose up -d
     -로그 출력: docker-compose logs 


## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
