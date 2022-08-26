import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@src/modules/auth/auth.module';
import { Order } from '@src/modules/order/order.entity';
import { OrderModule } from '@src/modules/order/order.module';
import { Pricelist } from '@src/modules/pricelist/pricelist.entity';
import { SpaceModule } from '@src/modules/space/space.module';
import { Space } from '@src/modules/space/space.entity';
import { PricelistResolver } from './pricelist.resolver';
import { PricelistService } from './pricelist.service';
import { IntegrationsModule } from '@src/modules/integrations/integrations.module';
import { GroupModule } from '@src/modules/group/group.module';
import { FileManagementModule } from '@src/libs/filemanagement/file-management.module';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Pricelist, Order, Space] }),
    FileManagementModule,
    AuthModule,
    SpaceModule,
    IntegrationsModule,
    GroupModule,
    forwardRef(() => OrderModule),
  ],
  providers: [PricelistService, PricelistResolver],
  exports: [PricelistService],
})
export class PricelistModule {}
