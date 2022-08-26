import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Context } from './context.type';

export { Context };

export const Ctx = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Context => {
    return GqlExecutionContext.create(ctx).getContext();
  }
);
