import { CanActivate, ExecutionContext, Type } from '@nestjs/common';
import { IAuthModuleOptions, AuthGuard } from '@nestjs/passport';
import { UserSession, GuestSession } from '@src/utils/context';
import {
  UserLoginSession,
  GuestLoginSession,
  AccessTokenSession,
} from '@src/modules/auth/auth.types';

type AuthGuardSession =
  | UserSession
  | GuestSession
  | UserLoginSession
  | GuestLoginSession
  | AccessTokenSession;

type IAuthGuard = CanActivate & {
  handleRequest(
    err: unknown,
    user: AuthGuardSession,
    info: unknown,
    context: ExecutionContext,
    status?: unknown
  ): Promise<AuthGuardSession> | AuthGuardSession;

  getAuthenticateOptions(
    context: ExecutionContext
  ): IAuthModuleOptions | undefined;
};
export const AuthGuardJWT = AuthGuard('jwt') as Type<IAuthGuard>;
