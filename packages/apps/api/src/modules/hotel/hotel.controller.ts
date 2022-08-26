import { Controller, Get } from '@nestjs/common';
import { GroupService } from '@src/modules/group/group.service';
import { Hotel, HotelApp } from './entities';
import { HotelService } from './hotel.service';

type FindAllHotelsResponse = Array<Hotel>;
type FindAppBuildsResponse = Array<
  HotelApp & { hotelId: string | undefined; groupId: string | undefined }
>;

@Controller('/hotels')
export class HotelController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly groupService: GroupService
  ) {}

  @Get()
  async findAll(): Promise<FindAllHotelsResponse> {
    const hotels: FindAllHotelsResponse = await this.hotelService.findAll();
    return hotels.map((hotel) => {
      delete hotel.payouts;
      return hotel;
    });
  }

  @Get('/app-builds')
  async findAppBuilds(): Promise<FindAppBuildsResponse> {
    const hotels = await this.hotelService.repository.find({
      ['app.metadata.ios.appStoreId' as keyof Hotel]: { $ne: null },
    });

    const groups = await this.groupService.repository.find({
      ['app.metadata.ios.appStoreId' as keyof Hotel]: { $ne: null },
    });

    const apps: FindAppBuildsResponse = [];

    hotels.forEach((hotel) => {
      if (hotel.app) {
        apps.push({ ...hotel.app, hotelId: hotel.id, groupId: undefined });
      }
    });

    groups.forEach((group) => {
      if (group.app) {
        apps.push({ ...group.app, groupId: group.id, hotelId: undefined });
      }
    });

    return apps;
  }
}
