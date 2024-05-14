![header](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=10&height=200&text=ProjectJ-Backend&fontSize=50&animation=twinkling&fontAlign=68&fontAlignY=36)
# 정의
﻿자취생들의 편의를 위한 사이트인 “자취만렙”에서 필요한 기능을 구현한 API 백엔드 서버이다.
NestJS 프레임워크에서 GraphQL 쿼리 언어를 사용하여 개발 완료 후 Docker를 통해 패키징 하였다.
현재, AWS EC2 인스턴스를 통해 배포 중이다.


# ﻿설치
### 환경변수 설정    
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;가. .env 설정
                                                        <pre><code>JWT_ACCESS_SECRET = (사용자 관리 중 JWT의 Access키 생성을 위한 암호)
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
</code></pre>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;나. .env.docker 설정
<pre><code>DATABASE_TYPE = (메인으로 사용할 데이터베이스의 종류 ex)mysql)
DATABASE_HOST = (데이터베이스 host 주소)
DATABASE_PORT= (데이터베이스 포트)
DATABASE_USERNAME = (데이터베이스 사용자명)
DATABASE_PASSWORD = (데이터베이스 암호)
DATABASE_DATABASE = (데이터베이스 스키마명)</code></pre>
### 프로젝트 파일 설치
<pre><code>git clone https://github.com/2024-Hansung-Capstone/ProjectJ-Backend.git
</code></pre>
### Docker
<pre><code>docker-compose build
docker-compose up
-백그라운드에서 실행: docker-compose up -d
-로그 출력: docker-compose logs 
</code></pre>

# ﻿Database 구조 (ERD)

![image](https://github.com/2024-Hansung-Capstone/ProjectJ-Backend/assets/157611169/60601345-f122-4f14-967e-64a9d3ae6594)


# ﻿Release Link

﻿http://13.209.72.136:5000/graphql

# ﻿Apollo GraphQL Playground UI
__<UI 설명>__    
![image](https://github.com/2024-Hansung-Capstone/ProjectJ-Backend/assets/157611169/4263d561-427e-4869-a452-114762befe22)   
<br>      

__<documentation 화면 설명>__    
![image](https://github.com/2024-Hansung-Capstone/ProjectJ-Backend/assets/157611169/6b6b72fc-7ca8-4ef5-986d-ac5d9b7c49e6)
 






# ﻿API 설명
### 사용자 관리   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;가. JWT 적용   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;사용자의 인증과 인가를 위해 JWT 기술 적용한다.   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;JWT 토큰에 사용자의 ID 값을 넣어서 사용자의 회원정보 일치 여부를 확인한다.   
__<사용 예시 화면>__   
![image](https://github.com/2024-Hansung-Capstone/ProjectJ-Backend/assets/157611169/dd86e155-2bf9-4088-aa17-b4953d26ba38)   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;나. ﻿휴대폰 본인인증 적용 (CoolSMS)   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;﻿CoolSMS의 API를 사용하여 사용자가 입력한 전화번호에 인증 메시지를 전송한다.   
__<인증 메시지 전송 예>__   
![image](https://github.com/2024-Hansung-Capstone/ProjectJ-Backend/assets/157611169/1e7e21fe-ae00-42d7-893d-24b0a7b6cd81)   

### 행정지역
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;﻿행정안전부에서 지정한 2024년 2월 1일 기준인 시도, 시군구, 행정동 코드를 사용한다.    
__<출처>__     
﻿https://www.mois.go.kr/frt/bbs/type001/commonSelectBoardArticle.do?bbsId=BBSMSTR_000000000052&nttId=106692






