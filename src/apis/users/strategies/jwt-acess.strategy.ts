import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

//strategy: AuthGuard를 통해 인증된 사용자만 필터링할 수 있는 기능을 구현
export default class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'heoga',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'sujin',
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
