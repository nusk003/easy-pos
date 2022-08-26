import { __jwt_secret__, __redis_uri__ } from '@constants';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from '@src/libs/redis';
import { Guest } from '@src/modules/guest/guest.entity';
import { GuestModule } from '@src/modules/guest/guest.module';
import { Hotel, HotelDomain } from '@src/modules/hotel/entities';
import { HotelModule } from '@src/modules/hotel/hotel.module';
import { HotelService } from '@src/modules/hotel/hotel.service';
import { MarketplaceAppModule } from '@src/modules/marketplace-app/marketplace-app.module';
import { Role } from '@src/modules/role/role.entity';
import { User } from '@src/modules/user/user.entity';
import { UserModule } from '@src/modules/user/user.module';
import { UserService } from '@src/modules/user/user.service';
import { AuthService } from './auth.service';
import { AccountsResolver } from './resolvers/accounts.resolvers';
import { AuthResolver } from './resolvers/auth.resolvers';
import { JWTStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [User, Guest, Hotel, HotelDomain, User, Role],
    }),
    RedisModule.forRoot({
      config: {
        url: __redis_uri__,
      },
    }),
    PassportModule.register({
      imports: [AuthModule],
      defaultStrategy: 'jwt',
      session: false,
      inject: [AuthService],
    }),
    JwtModule.registerAsync({
      useFactory: () => {
        const options: JwtModuleOptions = {
          secret: __jwt_secret__,
        };
        options.signOptions = {
          issuer: 'Hotel Manager',
        };
        return options;
      },
    }),
    UserModule,
    HotelModule,
    GuestModule,
    MarketplaceAppModule,
  ],
  providers: [
    AuthResolver,
    AccountsResolver,
    AuthService,
    HotelService,
    UserService,
    JWTStrategy,
  ],
  exports: [AuthService, HotelService, UserService],
})
export class AuthModule {}
