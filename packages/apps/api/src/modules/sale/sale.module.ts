import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@src/libs/elasticsearch';
import { AuthModule } from '@src/modules/auth/auth.module';
import { HotelModule } from '@src/modules/hotel/hotel.module';
import { CustomerModule } from '../customer/customer.module';
import { Sale } from './sale.entity';
import { SaleResolver } from './sale.resolver';
import { SaleService } from './sale.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Sale] }),
    ElasticsearchModule,
    AuthModule,
    HotelModule,
    CustomerModule,
  ],
  providers: [SaleService, SaleResolver],
  exports: [SaleService],
})
export class SaleModule {}
