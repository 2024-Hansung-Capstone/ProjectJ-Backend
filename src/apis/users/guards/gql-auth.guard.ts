import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

//graghql에서 authguard를 구현하기 위해서는 아래의 추가적인 구현이 필요하다(guards 폴더 생성)
export class gqlAccessGuard extends AuthGuard('heoga') {
  getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext().req;
  }
}

//accessToken이 만료되었지만, refreshToken이 있는 사람들이 restoreAccessToken을 하기 위해 생성
export class gqlAuthRefreshGuard extends AuthGuard('jaeheoga') {
  getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext().req;
  }
}
