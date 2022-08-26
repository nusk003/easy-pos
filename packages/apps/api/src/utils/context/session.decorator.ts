import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Session, Context } from './context.type';

export { Session };

export const Ses = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Session => {
    const context = <Context>GqlExecutionContext.create(ctx).getContext();

    return <Session>context.req.user;
  }
);
