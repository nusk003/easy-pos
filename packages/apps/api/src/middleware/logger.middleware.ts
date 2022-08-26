import { Injectable, NestMiddleware } from '@nestjs/common';
import { log } from '@src/utils/log';
import { FastifyReply, FastifyRequest } from 'fastify';

interface RequestBody {
  operationName: string | undefined;
  query: string | undefined;
  variables: Record<string, unknown>;
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(
    request: FastifyRequest['raw'],
    response: FastifyReply['raw'],
    next: () => void
  ) {
    let isMultipart = false;

    if (request.headers['content-type']?.includes('multipart/form-data')) {
      isMultipart = true;
    }

    const start = new Date();

    let rawBody = '';
    let body: RequestBody;
    let operation = '';
    let variables: Record<string, any>;

    request.on('data', (chunk) => {
      rawBody += chunk;
    });

    request.on('end', () => {
      if (!rawBody) {
        return;
      }

      try {
        if (!isMultipart) {
          body = JSON.parse(rawBody);
        } else {
          rawBody = rawBody.match(/(.*"query":"mutation.*)/)?.[0] || '';

          if (rawBody) {
            body = JSON.parse(rawBody);
          }
        }
        // eslint-disable-next-line no-empty
      } catch {}

      if (body?.query) {
        operation = <string>body?.query?.match(/[a-zA-Z]* [a-zA-Z]*/)?.[0];

        if (
          body.operationName !== 'IntrospectionQuery' &&
          body.query.indexOf('IntrospectionQuery') <= 0
        ) {
          if (
            !isMultipart &&
            body.variables &&
            Object.keys(body.variables).length
          ) {
            variables = body.variables;
          }
        }
      }
    });

    response.on('finish', () => {
      if (
        body?.query &&
        body.operationName !== 'IntrospectionQuery' &&
        body.query.indexOf('IntrospectionQuery') <= 0
      ) {
        const time = Number(new Date()) - Number(start);

        const message = `${operation} (${time}ms) ${
          variables ? '\n' + JSON.stringify(variables, null, 2) : ''
        }`;

        console.log();
        log.info('request', message);
      }
    });

    next();
  }
}
