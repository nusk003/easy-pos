import 'reflect-metadata';
import 'source-map-support/register';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as Sentry from '@sentry/node';
import fastifyCookie from 'fastify-cookie';
import { AppModule } from './app.module';
import { __dev__, __stage__ } from './constants';
import { graphqlUpload } from './middleware/graphql-upload.middleware';
import { BadRequestError } from './utils/errors';

const bootstrap = async () => {
  const adapter = new FastifyAdapter({ maxParamLength: 1000 });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter
  );

  app.register(graphqlUpload);
  app.register(fastifyCookie);

  if (!__dev__) {
    Sentry.init({
      dsn: 'https://669474687e4b4a46b87f666b89d398da@o429361.ingest.sentry.io/5861062',
      integrations: [new Sentry.Integrations.Http()],
      environment: __stage__,
    });

    app.use(Sentry.Handlers.requestHandler());
  }

  await app.init();
  await app.listen(80, '0.0.0.0');
};

bootstrap();
