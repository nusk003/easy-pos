import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  RefreshTokenSession,
  UserLoginSession,
} from '@src/modules/auth/auth.types';
import { AuthenticationError } from '@src/utils/errors';
import { AuthGuardJWT } from './util/auth-guard-jwt';

@Injectable()
export class UserLoginAuthGuard extends AuthGuardJWT {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    return request;
  }

  handleRequest(err: unknown, session: UserLoginSession, _info: unknown) {
    if (
      err ||
      !session?.userId ||
      (<RefreshTokenSession>session).refreshToken
    ) {
      throw new AuthenticationError();
    }

    return session;
  }
}
