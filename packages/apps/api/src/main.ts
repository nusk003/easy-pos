import 'reflect-metadata';
import 'source-map-support/register';
import {
  __https__,
  __port__,
  __sls_offline__,
  __whs_offline__,
} from '@constants';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { mewsStream } from '@src/microservices/mews-stream/mews-stream';
import { handler as sendHotelEmailNotificationsHandler } from '@src/microservices/send-email-notifications/send-hotel-email-notifications.handler';
import fastifyCookie from 'fastify-cookie';
import { readFileSync } from 'fs';
import { generateGraphQLTypes } from '../sdk/gql/graphql-types.generator';
import { AppModule } from './app.module';
import { MewsStreamService } from './microservices/mews-stream/mews-stream.service';
import { graphqlUpload } from './middleware/graphql-upload.middleware';
import { NestDevelopmentLogger } from './utils/log/nest-development-logger';
import { WSServerMock } from './websockets/mocks';

const bootstrap = async () => {
  const adapter = new FastifyAdapter(
    __https__
      ? {
          https: {
            allowHTTP1: true,
            key: readFileSync('../../../.cert/key.pem', 'utf8'),
            cert: readFileSync('../../../.cert/cert.pem', 'utf8'),
          },
          maxParamLength: 1000,
        }
      : {
          maxParamLength: 1000,
        }
  );

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    { logger: new NestDevelopmentLogger() }
  );

  app.register(graphqlUpload);
  app.register(fastifyCookie);

  await app.init();

  await app.listen(__port__ || 5000, '0.0.0.0', async () => {
    await generateGraphQLTypes();
  });

  if (!__whs_offline__) {
    await mewsStream.listen(8000, async () => {
      const mewsStreamService = MewsStreamService.getInstance();
      await mewsStreamService.initClients();
    });
  }

  setInterval(() => {
    sendHotelEmailNotificationsHandler();
  }, 1000);

  if (!__sls_offline__) {
    new WSServerMock();
  }
};

bootstrap();
