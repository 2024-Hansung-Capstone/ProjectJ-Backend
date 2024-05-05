import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export default class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'heoga',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
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
