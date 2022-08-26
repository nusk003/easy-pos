import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@src/modules/auth/auth.module';
import { Guest } from '@src/modules/guest/guest.entity';
import { GuestModule } from '@src/modules/guest/guest.module';
import { Hotel } from '@src/modules/hotel/entities';
import { HotelModule } from '@src/modules/hotel/hotel.module';
import { Order } from '@src/modules/order/order.entity';
import { UserModule } from '@src/modules/user/user.module';
import { PaymentsResolver } from './payments.resolver';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Guest, Order, Hotel] }),
    HotelModule,
    GuestModule,
    UserModule,
    forwardRef(() => AuthModule),
  ],
  providers: [PaymentsService, PaymentsResolver],
  exports: [PaymentsService],
})
export class PaymentsModule {}
