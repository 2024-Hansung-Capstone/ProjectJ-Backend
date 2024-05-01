# 1. 운영체제 설치(node 최신버전과 npm과 yarn이 모두 설치되어있는 리눅스)
FROM node:latest

# 2. 내 컴퓨터에 있는 폴더나 파일을 도커 컴퓨터 안으로 복사하기
COPY ./package.json /ProjectJ-Backend/
COPY ./yarn.lock /ProjectJ-Backend/
WORKDIR /ProjectJ-Backend/
RUN yarn install
ENV NODE_OPTIONS="--max-old-space-size=1024"
COPY . /ProjectJ-Backend/

# 3. 도커안에서 index.js 실행시키기
CMD yarn start:dev