import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

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
