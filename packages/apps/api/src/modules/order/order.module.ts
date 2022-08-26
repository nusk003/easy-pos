import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@src/libs/elasticsearch';
import { AuthModule } from '@src/modules/auth/auth.module';
import { BookingModule } from '@src/modules/booking/booking.module';
import { GuestModule } from '@src/modules/guest/guest.module';
import { HotelModule } from '@src/modules/hotel/hotel.module';
import { IntegrationsModule } from '@src/modules/integrations/integrations.module';
import { Order } from '@src/modules/order/order.entity';
import { PaymentsModule } from '@src/modules/payments/payments.module';
import { PricelistModule } from '@src/modules/pricelist/pricelist.module';
import { SpaceModule } from '@src/modules/space/space.module';
import { Thread } from '@src/modules/thread/thread.entity';
import { GroupModule } from '@src/modules/group/group.module';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Order, Thread] }),
    ElasticsearchModule,
    AuthModule,
    HotelModule,
    IntegrationsModule,
    BookingModule,
    PricelistModule,
    SpaceModule,
    GuestModule,
    PaymentsModule,
    IntegrationsModule,
    GroupModule,
  ],
  providers: [OrderService, OrderResolver],
  exports: [OrderService],
})
export class OrderModule {}
