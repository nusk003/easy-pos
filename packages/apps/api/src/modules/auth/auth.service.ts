import {
  __cloud_console_url__,
  __dev__,
  __guest_app_web_url__,
  __hm_group_id__,
  __https__,
} from '@constants';
import { InjectRedis } from '@libs/redis';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Scope } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Guest } from '@src/modules/guest/guest.entity';
import { Hotel } from '@src/modules/hotel/entities';
import { User } from '@src/modules/user/user.entity';
import { isCloudConsoleOrigin } from '@src/utils/auth';
import { Context } from '@src/utils/context/context.type';
import { email } from '@src/utils/email/sendgrid';
import { AuthenticationError, InternalError } from '@src/utils/errors';
import dayjs from 'dayjs';
import { CookieSerializeOptions } from 'fastify-cookie';
import { Pipeline, Redis } from 'ioredis';
import { v4 as uuid } from 'uuid';
import {
  AccessTokenSession,
  CookieName,
  GuestLoginSession,
  GuestSession,
  JWTPayload,
  RefreshTokenSession,
  Session,
  UserLoginSession,
  UserSession,
} from './auth.types';
import { UserRole } from './guards';

@Injectable({ scope: Scope.TRANSIENT })
export class AuthService {
  context: Context;

  constructor(
    private readonly jwtService: JwtService,
    @InjectRedis()
    private readonly redis: Redis,
    @InjectRepository(Hotel)
    private readonly hotelRepository: EntityRepository<Hotel>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>
  ) {}

  private validatePayload(payload: JWTPayload) {
    if (payload.iss !== 'Hotel Manager' || !payload.t) {
      throw new AuthenticationError();
    }
  }

  private createContext(context: Context) {
    this.context = context;
  }

  private async setSession({
    key,
    session,
    ttl,
    pipeline,
  }: {
    key: string;
    session: Session;
    ttl: number;
    pipeline?: Pipeline;
  }) {
    let exec = false;
    if (!pipeline) {
      exec = true;
      pipeline = this.redis.pipeline();
    }

    if (ttl > -1) {
      pipeline.setex(key, ttl, JSON.stringify(session));
    } else {
      pipeline.set(key, JSON.stringify(session));
    }

    if (exec === true) {
      await pipeline.exec();
    }
  }

  private async extendSession({
    key,
    ttl,
    pipeline,
  }: {
    key: string;
    ttl: number;
    pipeline?: Pipeline;
  }) {
    let exec = false;
    if (!pipeline) {
      exec = true;
      pipeline = this.redis.pipeline();
    }
    pipeline.expire(key, ttl);

    if (exec === true) {
      await pipeline.exec();
    }
  }

  private setCookie({
    jwt,
    ttl = 60 * 60 * 24 * 30,
  }: {
    jwt: string;
    ttl?: number;
  }) {
    if (!this.context) {
      throw new InternalError(
        'Invalid method pipeline. Must call createContext before this method.'
      );
    }

    const name = isCloudConsoleOrigin(this.context.req.headers.origin)
      ? CookieName.User
      : CookieName.Guest;

    const config: CookieSerializeOptions = {
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      expires: dayjs().add(ttl, 'seconds').toDate(),
    };

    if (__dev__ && !__https__) {
      config.sameSite = 'lax';
      config.secure = false;
    }

    this.context.res.setCookie(name, jwt, config);
  }

  private setAuthHeader({ jwt }: { jwt: string }) {
    if (!this.context) {
      throw new InternalError(
        'Invalid method pipeline. Must call createContext before this method.'
      );
    }

    this.context.res.header('Authorization', jwt);
  }

  createJWT({
    token,
    ttl = 60 * 60 * 24 * 30,
  }: {
    token: string;
    ttl?: number;
  }) {
    const jwt: JWTPayload = {
      t: token,
    };

    if (ttl > -1) {
      return this.jwtService.sign(jwt, { expiresIn: ttl });
    } else {
      return this.jwtService.sign(jwt);
    }
  }

  decryptJWT(token: string) {
    return (<Record<string, string>>this.jwtService.decode(token)).t;
  }

  getUserLoginLink(
    key: string,
    redirectURL?: string,
    hotelId?: string,
    hideSidebar?: boolean
  ) {
    const userLoginToken = this.createJWT({
      token: key,
      ttl: 10 * 60,
    });

    let loginLink = `${__cloud_console_url__}/authenticate?token=${userLoginToken}`;

    if (redirectURL) {
      loginLink += '&redirect_url=' + redirectURL;
    }

    if (hotelId) {
      loginLink += '&hotel_id=' + hotelId;
    }

    if (hideSidebar) {
      loginLink += '&hide_sidebar=' + hideSidebar;
    }

    return loginLink;
  }

  async createUserTokenSession(user: User) {
    const key = uuid();

    const session = { userId: user.id, token: user.verificationToken };

    await this.setSession({
      key,
      session,
      ttl: 10 * 60,
    });

    return key;
  }

  async getUserToken(
    user: User,
    redirectURL?: string,
    hotelId?: string,
    hideSidebar?: boolean
  ) {
    const key = await this.createUserTokenSession(user);

    const loginLink = this.getUserLoginLink(
      key,
      redirectURL,
      hotelId,
      hideSidebar
    );

    return loginLink;
  }

  async sendUserToken(user: User, verificationTokenOnly?: boolean) {
    const key = await this.createUserTokenSession(user);

    const loginLink = this.getUserLoginLink(key);

    await email.sendUserLogin({
      to: user.email,
      subject: `Login to your Dashboard (Requested on ${dayjs().format(
        'YYYY-MM-DD hh:mm:ss A [GMT]'
      )})`,
      data: {
        loginLink,
        token: user.verificationToken!,
        verificationTokenOnly: !!verificationTokenOnly,
      },
    });
  }

  async authenticateUser(user: User, context: Context) {
    this.createContext(context);

    const session = <UserLoginSession | undefined>this.context.req.user;

    const key = uuid();

    const userSession: UserSession = {
      userId: user.id,
    };

    const pipeline = this.redis.pipeline();

    if (session?.payload?.t) {
      pipeline.del(session.payload.t);
    }

    this.setSession({
      key,
      session: userSession,
      ttl: 60 * 60 * 24 * 30,
      pipeline,
    });
    await pipeline.exec();

    const jwt = this.createJWT({
      token: key,
    });

    this.setCookie({ jwt });
    this.setAuthHeader({ jwt });

    return jwt;
  }

  async logoutUser(context: Context) {
    this.createContext(context);

    const session = <UserSession | GuestSession>this.context.req.user;

    await this.redis.del(session.payload!.t);

    if ('guestId' in session) {
      this.context.res.clearCookie('gid');
    }

    if ('userId' in session) {
      this.context.res.clearCookie('uid');
    }
  }

  async expireSession(session: Session) {
    await this.redis.del(session!.payload!.t);
  }

  async reauthenticateUser(
    session: UserSession | GuestSession,
    context: Context
  ) {
    this.createContext(context);

    const key = session.payload!.t;

    await this.extendSession({
      key,
      ttl: 60 * 60 * 24 * 30,
    });

    const jwt = this.createJWT({
      token: key,
    });

    this.setCookie({ jwt });
    this.setAuthHeader({ jwt });
  }

  async reauthenticateAnonGuest(key: string, guest: Guest, context: Context) {
    this.createContext(context);

    const session = await this.redis.get(key);

    if (!session) {
      await this.authenticateGuest(guest, context, { anonAuth: true });
    } else {
      await this.extendSession({
        key,
        ttl: 60 * 60 * 24 * 30,
      });

      const jwt = this.createJWT({
        token: key,
      });

      this.setCookie({ jwt });
      this.setAuthHeader({ jwt });
    }
  }

  generateLoginToken(): { token: string; expiry: Date } {
    const token = String(Math.floor(100000 + Math.random() * 900000));
    const expiry = dayjs().add(10, 'minutes').toDate();

    return { token, expiry };
  }

  async authenticateGuest(
    guest: Guest,
    context: Context,
    options: { anonAuth: boolean } = { anonAuth: false }
  ) {
    this.createContext(context);

    const session = <GuestLoginSession | undefined>this.context.req.user;

    const key = session?.payload?.t || uuid();

    const guestSession: GuestSession = {
      guestId: guest.id,
      anonAuth: options.anonAuth,
      deviceId: guest.deviceId!,
    };

    const pipeline = this.redis.pipeline();

    if (session?.payload?.t) {
      pipeline.del(session.payload.t);
    }

    await this.setSession({
      key,
      session: guestSession,
      ttl: 60 * 60 * 24 * 30,
      pipeline,
    });

    await pipeline.exec();

    const jwt = this.createJWT({
      token: key,
    });

    this.setCookie({ jwt });
    this.setAuthHeader({ jwt });
  }

  async sendGuestToken(guest: Guest, hotel: Hotel, anonKey: string) {
    const key = uuid();

    const session = <GuestLoginSession>{
      guestId: guest.id,
      deviceId: guest.deviceId,
      token: guest.verificationToken,
      sessionId: anonKey,
    };

    await this.setSession({
      key,
      session: session,
      ttl: 10 * 60,
    });

    const guestLoginToken = this.createJWT({
      token: key,
      ttl: 10 * 60,
    });

    const loginLink = `${__guest_app_web_url__}/${hotel.id}?token=${guestLoginToken}`;

    await email.sendGuestLogin({
      to: guest.email!,
      subject: `Login to ${hotel.name} (Requested on ${dayjs().format(
        'YYYY-MM-DD hh:mm:ss A [GMT]'
      )})`,
      data: {
        hotelName: hotel.name,
        firstName: guest.firstName!,
        lastName: guest.lastName!,
        token: guest.verificationToken!,
        loginLink,
      },
    });
  }

  async deleteSession(key: string) {
    await this.redis.del(key);
  }

  async getSession(payload: JWTPayload) {
    this.validatePayload(payload);

    const value = await this.redis.get(payload.t);

    if (!value) {
      throw new AuthenticationError();
    }

    const session = <Session>JSON.parse(value!);

    return { ...session, payload };
  }

  async authenticateMarketplaceApp(
    marketplaceId: string,
    userId: string,
    redirectURL: string
  ) {
    const key = uuid();

    const session: RefreshTokenSession = {
      marketplaceId,
      userId,
      refreshToken: true,
    };

    await this.setSession({
      key,
      session,
      ttl: -1,
    });

    const jwt = this.createJWT({
      token: key,
    });

    redirectURL += `?auth_token=${jwt}`;

    return redirectURL;
  }

  async authenticateMarketplaceAppUser(authTokenJwt: string, hotelId?: string) {
    const payload = <JWTPayload>this.jwtService.decode(authTokenJwt);

    if (!payload?.t) {
      throw new AuthenticationError();
    }

    const authToken = payload.t;

    const rawSession = await this.redis.get(authToken);

    if (!rawSession) {
      throw new AuthenticationError();
    }

    const session = <RefreshTokenSession>JSON.parse(rawSession);

    const marketplaceId = session.marketplaceId;
    const userId = session.userId;

    if (!session.refreshToken) {
      throw new AuthenticationError();
    }

    if (hotelId) {
      const user = await this.userRepository.findOne(session.userId, {
        populate: ['roles'],
      });

      if (
        !user ||
        !user.hotels.contains(this.hotelRepository.getReference(hotelId))
      ) {
        throw new AuthenticationError();
      }

      if (user.group.id !== __hm_group_id__ && !user.groupAdmin) {
        const hotelRole = user.roles
          .getItems()
          .find((role) => role.hotel.id === hotelId);

        if (hotelRole?.role !== UserRole.HotelAdmin) {
          throw new AuthenticationError();
        }
      }

      const hotel = await this.hotelRepository.findOne(hotelId);

      if (
        !hotel?.integrations?.marketplaceApps?.find(
          (app) => app.id.toString() === marketplaceId
        )
      ) {
        throw new AuthenticationError();
      }
    }

    const refreshTokenKey = uuid();
    const accessTokenKey = uuid();

    const accessTokenSession: AccessTokenSession = {
      marketplaceId,
      userId,
      hotel: hotelId,
      accessToken: true,
    };

    const pipeline = this.redis.pipeline();

    pipeline.rename(authToken, refreshTokenKey);

    this.setSession({
      key: accessTokenKey,
      session: accessTokenSession,
      ttl: 60 * 60,
      pipeline,
    });

    await pipeline.exec();

    const refreshToken = this.createJWT({
      token: refreshTokenKey,
    });

    const accessToken = this.createJWT({
      token: accessTokenKey,
    });

    return { refreshToken, accessToken };
  }
}
