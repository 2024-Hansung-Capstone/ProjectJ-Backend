import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jaeheoga') {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        let refreshToken = null;
        if (req && req.headers.cookie) {
          const cookies = req.headers.cookie
            .split(';')
            .map((cookie) => cookie.trim());
          const refreshTokenCookie = cookies.find((cookie) =>
            cookie.startWith('refreshToken='),
          );
          if (refreshTokenCookie) {
            refreshToken = refreshTokenCookie.replace('refreshToken=', '');
            //header 안에 cookie의 refreshToken= 부분을 지워주면서 온전한 refreshToken 값을 받아옴
          }
        }
        return refreshToken;
      },
      secretOrKey: 'sujin2',
    });
  }

  //인증
  validate(payload) {
    console.log(payload);
    return {
      id: payload.sub,
    };
  }
}
