import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '@src/modules/auth/auth.service';
import { RefreshTokenSession, UserSession } from '@src/modules/auth/auth.types';
import { UserService } from '@src/modules/user/user.service';
import { AuthenticationError } from '@src/utils/errors';
import { AuthGuardJWT } from './util/auth-guard-jwt';

@Injectable()
export class UserGuard extends AuthGuardJWT {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    return request;
  }

  async handleRequest(
    err: unknown,
    session: UserSession,
    _info: unknown,
    ctx: ExecutionContext
  ) {
    if (
      err ||
      !session?.userId ||
      (<RefreshTokenSession>session).refreshToken
    ) {
      throw new AuthenticationError();
    }

    const context = GqlExecutionContext.create(ctx);

    const user = await this.userService.findOne(session.userId);
    session.group = user.group.id;

    await this.authService.reauthenticateUser(session, context.getContext());

    return session;
  }
}
