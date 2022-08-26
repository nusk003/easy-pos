import { mikroORMConfig } from '@config/mikro-orm.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  Controller,
  Get,
  MiddlewareConsumer,
  Module,
  NestApplicationOptions,
  RequestMethod,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-fastify';
import { StripeModule } from 'nestjs-stripe';
import { join } from 'path';
import { __dev__, __prod__, __stg__, __stripe_sk__ } from './constants';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AttractionModule } from './modules/attraction/attraction.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookingModule } from './modules/booking/booking.module';
import { CustomerModule } from './modules/customer/customer.module';
import { GuestModule } from './modules/guest/guest.module';
import { HotelModule } from './modules/hotel/hotel.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { MarketplaceAppModule } from './modules/marketplace-app/marketplace-app.module';
import { MessageModule } from './modules/message/message.module';
import { OrderModule } from './modules/order/order.module';
import { PricelistModule } from './modules/pricelist/pricelist.module';
import { ProductModule } from './modules/product/product.module';
import { SaleModule } from './modules/sale/sale.module';
import { SpaceModule } from './modules/space/space.module';
import { ThreadModule } from './modules/thread/thread.module';
import { UserModule } from './modules/user/user.module';
import { BaseSubscriber } from './utils/entity/base.subscriber';
import { ErrorHandlerPlugin } from './utils/errors';

const cors: NestApplicationOptions['cors'] = {
  origin: true,
  maxAge: 86400,
  credentials: true,
  exposedHeaders: [
    'Content-Range',
    'Authorization',
    'Content-Type',
    'Accept',
    'Access-Control-Allow-Origin',
  ],
};

@Controller('')
class MainController {
  @Get()
  async main() {
    return 'OK';
  }

  @Get('/_healthcheck')
  async healthcheck() {
    return 'OK';
  }
}

@Module({
  imports: [
    MikroOrmModule.forRoot({
      ...mikroORMConfig({
        subscribers: [new BaseSubscriber()],
        pool: {
          min: __stg__ ? 20 : 40,
          max: __stg__ ? 50 : 200,
        },
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      context: ({ req, reply }) => ({ req, res: reply }),
      cors,
      autoSchemaFile: __dev__
        ? join(process.cwd(), 'sdk/gql/schema.gql')
        : true,
      debug: __prod__ ? false : true,
      formatError: (err) => {
        if (__prod__ && err.extensions?.code === 'INTERNAL_SERVER_ERROR') {
          return new Error('Internal server error');
        }
        return err;
      },
    }),
    StripeModule.forRoot({
      apiKey: __stripe_sk__,
      apiVersion: '2020-08-27',
    }),
    AttractionModule,
    AuthModule,
    BookingModule,
    GuestModule,
    HotelModule,
    IntegrationsModule,
    MarketplaceAppModule,
    MessageModule,
    OrderModule,
    PricelistModule,
    ThreadModule,
    SpaceModule,
    UserModule,
    ProductModule,
    CustomerModule,
    SaleModule,
  ],
  controllers: [MainController],
  providers: [
    ErrorHandlerPlugin,
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          exceptionFactory: (errors: ValidationError[]) => {
            const errorMessages: string[] = [];

            const getErrors = (errors: ValidationError[]) => {
              errors.flatMap((error) => {
                if (error.children?.length) {
                  getErrors(error.children);
                } else {
                  errorMessages.push(...Object.values(error.constraints || {}));
                }
              });
            };

            getErrors(errors);

            const error = new UserInputError('VALIDATION_ERROR', {
              invalidArgs: errorMessages,
            });

            delete error.stack;

            return error;
          },
          transform: true,
          forbidUnknownValues: true,
        }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    if (__dev__) {
      consumer
        .apply(LoggerMiddleware)
        .forRoutes({ path: '*', method: RequestMethod.POST });
    }
  }
}
