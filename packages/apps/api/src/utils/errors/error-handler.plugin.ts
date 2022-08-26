import { Plugin } from '@nestjs/apollo';
import * as Sentry from '@sentry/node';
import { __dev__ } from '@src/constants';
import { ApolloError } from 'apollo-server-fastify';
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';

@Plugin()
export class ErrorHandlerPlugin implements ApolloServerPlugin {
  async requestDidStart(): Promise<GraphQLRequestListener> {
    return {
      async didEncounterErrors(ctx) {
        if (__dev__ || !ctx.operation) {
          return;
        }

        for (const err of ctx.errors) {
          if (err instanceof ApolloError) {
            continue;
          }

          Sentry.withScope((scope) => {
            scope.setTag('kind', ctx.operation?.operation);

            scope.setExtra('query', ctx.request.query);
            scope.setExtra('variables', ctx.request.variables);
            scope.setExtra('session', ctx.context.req.user);

            if (err.path) {
              scope.addBreadcrumb({
                category: 'query-path',
                message: err.path.join(' > '),
                level: Sentry.Severity.Debug,
              });
            }

            const transactionId =
              ctx.request.http?.headers.get('x-transaction-id');
            if (transactionId) {
              scope.setTransactionName(transactionId);
            }

            Sentry.captureException(err);
          });
        }
      },
    };
  }
}
