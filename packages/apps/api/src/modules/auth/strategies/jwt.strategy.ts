import { __jwt_secret__ } from '@constants';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '@src/modules/auth/auth.service';
import { Cookies, JWTPayload } from '@src/modules/auth/auth.types';
import { isCloudConsoleOrigin } from '@src/utils/auth';
import { FastifyRequest } from 'fastify';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: (
        req: FastifyRequest<{
          Params: { token: string };
        }>
      ) => {
        const cookies = <Cookies>req.cookies;
        const authHeader = req.headers.authorization;
        const token = req.params.token;

        if (authHeader && authHeader.includes('Bearer')) {
          return authHeader.split('Bearer ')[1];
        }

        if (token) {
          return token;
        }

        if (isCloudConsoleOrigin(req.headers.origin) && cookies?.uid) {
          return cookies.uid;
        }

        if (cookies?.gid) {
          return cookies.gid;
        }
      },
      secretOrKey: __jwt_secret__,
    });
  }

  async validate(payload: JWTPayload) {
    return this.authService.getSession(payload);
  }
}
