import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { ElasticsearchModule } from '@src/libs/elasticsearch';
import { FileManagementModule } from '@src/libs/filemanagement/file-management.module';
import { AuthModule } from '@src/modules/auth/auth.module';
import { GroupModule } from '@src/modules/group/group.module';
import { Hotel, HotelDomain } from './entities';
import { HotelController } from './hotel.controller';
import { HotelResolver } from './hotel.resolver';
import { HotelService } from './hotel.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Hotel, HotelDomain] }),
    ElasticsearchModule,
    FileManagementModule,
    GroupModule,
    forwardRef(() => AuthModule),
  ],
  providers: [HotelService, HotelResolver],
  controllers: [HotelController],
  exports: [HotelService],
})
export class HotelModule {}
