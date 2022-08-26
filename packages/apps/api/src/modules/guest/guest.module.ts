import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { ElasticsearchModule } from '@src/libs/elasticsearch';
import { AuthModule } from '@src/modules/auth/auth.module';
import { HotelModule } from '@src/modules/hotel/hotel.module';
import { Guest } from './guest.entity';
import { GuestResolver } from './guest.resolver';
import { GuestService } from './guest.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Guest] }),
    ElasticsearchModule,
    HotelModule,
    forwardRef(() => AuthModule),
  ],
  providers: [GuestService, GuestResolver],
  exports: [GuestService],
})
export class GuestModule {}
