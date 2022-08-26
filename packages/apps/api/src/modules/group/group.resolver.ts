import { Args, Query, Resolver } from '@nestjs/graphql';
import { Hotel } from '@src/modules/hotel/entities';
import { SDKQuery } from '@src/utils/gql';
import { HotelsWhereInput } from './dto/group.args';
import { GroupService } from './group.service';

@Resolver()
export class GroupResolver {
  constructor(private readonly groupService: GroupService) {}

  @Query(() => [Hotel], { name: 'hotels' })
  @SDKQuery(() => [Hotel], { name: 'hotels' })
  async getHotels(
    @Args() hotelsWhereInput: HotelsWhereInput
  ): Promise<Hotel[]> {
    const hotels = await this.groupService.findHotels(hotelsWhereInput.groupId);
    return hotels;
  }
}
