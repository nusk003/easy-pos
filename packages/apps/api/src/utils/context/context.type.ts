import { GqlExecutionContext } from '@nestjs/graphql';
import { GuestSession, UserSession } from '@src/modules/auth/auth.types';
import { FastifyReply, FastifyRequest } from 'fastify';

export type Session = GuestSession | UserSession;

export type Context = GqlExecutionContext & {
  res: FastifyReply;
  req: FastifyRequest<{ Headers: 'hotel-id' }> & { user?: Session };
};
