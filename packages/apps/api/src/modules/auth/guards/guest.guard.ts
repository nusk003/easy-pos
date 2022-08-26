import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '@src/modules/auth/auth.service';
import { GuestSession } from '@src/modules/auth/auth.types';
import { AuthenticationError } from '@src/utils/errors';
import { AuthGuardJWT } from './util/auth-guard-jwt';

@Injectable()
export class GuestGuard extends AuthGuardJWT {
  constructor(private readonly authService: AuthService) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    return request;
  }

  async handleRequest(
    err: unknown,
    session: GuestSession,
    _info: unknown,
    ctx: ExecutionContext
  ) {
    if (err || !session?.guestId) {
      throw new AuthenticationError();
    }

    const context = GqlExecutionContext.create(ctx);

    await this.authService.reauthenticateUser(session, context.getContext());

    return session;
  }
}
