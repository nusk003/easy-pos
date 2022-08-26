import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { __jwt_secret__ } from '@src/constants';
import { ElasticsearchModule } from '@src/libs/elasticsearch';
import { AuthModule } from '@src/modules/auth/auth.module';
import { BookingModule } from '@src/modules/booking/booking.module';
import { Group } from '@src/modules/group/entities/group.entity';
import { GroupModule } from '@src/modules/group/group.module';
import { GuestModule } from '@src/modules/guest/guest.module';
import { Hotel } from '@src/modules/hotel/entities';
import { HotelModule } from '@src/modules/hotel/hotel.module';
import { UserModule } from '@src/modules/user/user.module';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsResolver } from './integrations.resolver';
import { IntegrationsApaleoService } from './services/integrations-apaleo.service';
import { IntegrationsMewsService } from './services/integrations-mews.service';
import { IntegrationsOmnivoreService } from './services/integrations-omnivore.service';
import { IntegrationsService } from './services/integrations.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        const options: JwtModuleOptions = {
          secret: __jwt_secret__,
          signOptions: {
            issuer: 'Hotel Manager',
          },
        };

        return options;
      },
    }),
    MikroOrmModule.forFeature({ entities: [Group, Hotel] }),
    ElasticsearchModule,
    AuthModule,
    HotelModule,
    GroupModule,
    GuestModule,
    UserModule,
    forwardRef(() => BookingModule),
  ],
  controllers: [IntegrationsController],
  providers: [
    IntegrationsResolver,
    IntegrationsApaleoService,
    IntegrationsMewsService,
    IntegrationsOmnivoreService,
    IntegrationsService,
  ],
  exports: [
    IntegrationsApaleoService,
    IntegrationsMewsService,
    IntegrationsOmnivoreService,
  ],
})
export class IntegrationsModule {}
