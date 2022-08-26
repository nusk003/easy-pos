import { __jwt_secret__, __redis_uri__ } from '@src/constants';
import {
  GuestSession,
  UserSession,
  JWTPayload,
  Session,
  WSAuthSession,
} from '@src/modules/auth/auth.types';
import { LambdaAuthenticationError } from '@src/utils/errors';
import { WSEvent } from '@hm/sdk';
import Redis from 'ioredis';
import jwt from 'jsonwebtoken';

export interface WSGuestSession extends GuestSession {
  connectionId: string;
}

export interface WSUserSession extends UserSession {
  connectionId: string;
}

let redis: Redis.Redis;

export class AuthService {
  constructor() {
    if (!redis) {
      redis = new Redis(__redis_uri__);
    }
  }

  private validateJWT(token: string) {
    const payload = <JWTPayload>jwt.verify(token, __jwt_secret__);
    return payload;
  }

  private validatePayload(payload: JWTPayload) {
    if (payload.iss !== 'Hotel Manager' || !payload.t) {
      throw new LambdaAuthenticationError();
    }
  }

  private getJWT(event: WSEvent) {
    return event.queryStringParameters.Auth;
  }

  private getHotelId(event: WSEvent) {
    return event.queryStringParameters['hotel-id'];
  }

  private async createSession(
    connectionId: string,
    sessionId: string,
    hotelId: string
  ) {
    const ttl = 60 * 60 * 24 * 30;
    await redis.setex(
      connectionId,
      ttl,
      JSON.stringify({ sessionId, hotel: hotelId })
    );
  }

  async getSession(event: WSEvent): Promise<WSUserSession | WSGuestSession> {
    const { connectionId } = event.requestContext;

    const rawAuthSession = await redis.get(connectionId);

    if (!rawAuthSession) {
      throw new LambdaAuthenticationError();
    }

    const authSession: WSAuthSession = JSON.parse(rawAuthSession);

    const rawSession = await redis.get(authSession.sessionId);

    if (!rawSession) {
      throw new LambdaAuthenticationError();
    }

    const session = <Session>JSON.parse(rawSession!);

    const ttl = 60 * 60 * 24 * 30;
    await redis.expire(connectionId, ttl);

    return <WSUserSession | WSGuestSession>{
      ...session,
      hotel: authSession.hotel,
      connectionId,
    };
  }

  async deleteSession(event: WSEvent) {
    const { connectionId } = event.requestContext;
    await redis.del(connectionId);
  }

  async decryptSession(
    event: WSEvent
  ): Promise<WSUserSession | WSGuestSession> {
    const { connectionId } = event.requestContext;

    const token = this.getJWT(event);

    const payload = this.validateJWT(token);

    this.validatePayload(payload);

    const hotelId = this.getHotelId(event);

    const rawSession = await redis.get(payload.t);

    if (!rawSession) {
      throw new LambdaAuthenticationError();
    }

    const session = <Session>JSON.parse(rawSession!);

    await this.createSession(connectionId, payload.t, hotelId);

    return <WSUserSession | WSGuestSession>{ ...session, payload };
  }

  generateAuthPolicy(methodArn: string) {
    const authResponse: Record<string, any> = {};
    authResponse.principalId = 'user';

    const policyDocument: Record<string, any> = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];

    const statementOne: Record<string, any> = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = 'Allow';
    statementOne.Resource = methodArn;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;

    return authResponse;
  }
}
