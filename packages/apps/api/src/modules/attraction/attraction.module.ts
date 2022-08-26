import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { FileManagementModule } from '@src/libs/filemanagement/file-management.module';
import { AuthModule } from '@src/modules/auth/auth.module';
import { Hotel } from '@src/modules/hotel/entities';
import { HotelModule } from '@src/modules/hotel/hotel.module';
import { Attraction } from './attraction.entity';
import { AttractionResolver } from './attraction.resolver';
import { AttractionService } from './attraction.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Hotel, Attraction] }),
    HotelModule,
    AuthModule,
    FileManagementModule,
  ],
  providers: [AttractionService, AttractionResolver],
  exports: [AttractionService],
})
export class AttractionModule {}
