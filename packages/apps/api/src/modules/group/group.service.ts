import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Scope } from '@nestjs/common';
import { Hotel } from '@src/modules/hotel/entities';
import { NotFoundError } from '@src/utils/errors';
import { BaseService } from '@src/utils/service';
import { Group } from './entities';

@Injectable({ scope: Scope.REQUEST })
export class GroupService extends BaseService<Group> {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: EntityRepository<Group>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: EntityRepository<Hotel>
  ) {
    super(groupRepository);
  }

  async findOne(id: string) {
    const group = await this.groupRepository.findOne(id);

    if (!group) {
      throw new NotFoundError(Group, { id });
    }

    return group;
  }

  async findOneByHotelId(id: string) {
    const hotel = await this.hotelRepository.findOne(id, {
      populate: ['group'],
    });

    if (!hotel) {
      throw new NotFoundError(Group, { id });
    }

    return hotel.group;
  }

  async findHotels(groupId: string) {
    const hotels = this.hotelRepository.find(
      { group: groupId },
      { populate: ['group'] }
    );

    if (!(await hotels).length) {
      throw new NotFoundError(Group, { id: groupId });
    }

    return hotels;
  }
}
