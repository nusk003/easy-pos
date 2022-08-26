import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { ElasticsearchModule } from '@src/libs/elasticsearch';
import { AuthModule } from '@src/modules/auth/auth.module';
import { GroupModule } from '@src/modules/group/group.module';
import { Guest } from '@src/modules/guest/guest.entity';
import { GuestModule } from '@src/modules/guest/guest.module';
import { IntegrationsModule } from '@src/modules/integrations/integrations.module';
import { HotelModule } from '@src/modules/hotel/hotel.module';
import { Booking } from './booking.entity';
import { BookingResolver } from './booking.resolver';
import { BookingsService } from './booking.service';

@Module({
  imports: [
    AuthModule,
    MikroOrmModule.forFeature({ entities: [Booking, Guest] }),
    ElasticsearchModule,
    GuestModule,
    forwardRef(() => IntegrationsModule),
    HotelModule,
    GroupModule,
  ],
  providers: [BookingsService, BookingResolver],
  exports: [BookingsService],
})
export class BookingModule {}
