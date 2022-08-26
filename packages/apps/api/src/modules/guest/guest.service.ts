import { RequestParams } from '@elastic/elasticsearch';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { forwardRef, Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { ElasticsearchService } from '@src/libs/elasticsearch';
import { HotelService } from '@src/modules/hotel/hotel.service';
import { Context, GuestSession, UserSession } from '@src/utils/context';
import { MissingHeaderError, NotFoundError } from '@src/utils/errors';
import { BaseService, FindOptions } from '@src/utils/service';
import dayjs from 'dayjs';
import { GuestPaginationSearchArgs } from './dto/guest.args';
import { Guest } from './guest.entity';

interface GuestFindOneOptions<P extends string> {
  populate: FindOptions<Guest, P>['populate'];
}

@Injectable({ scope: Scope.REQUEST })
export class GuestService extends BaseService<Guest> {
  constructor(
    @InjectRepository(Guest)
    private readonly guestRepository: EntityRepository<Guest>,
    @Inject(forwardRef(() => HotelService))
    private hotelService: HotelService,
    @Inject(CONTEXT) private context: Context,
    private readonly elasticsearch: ElasticsearchService
  ) {
    super(guestRepository);
  }

  get session() {
    return <GuestSession | UserSession>this.context.req.user;
  }

  async findOne<P extends string>(id: string, opts?: GuestFindOneOptions<P>) {
    const guest = await this.guestRepository.findOne(id, {
      populate: opts?.populate,
    });

    if (!guest) {
      throw new NotFoundError(Guest, { id });
    }

    return guest;
  }

  async findOneByEmail(email: string) {
    const guest = await this.guestRepository.findOne({ email });

    if (!guest) {
      throw new NotFoundError(Guest, { email });
    }

    return guest;
  }

  async findByPMSIntegrationID(pmsId: string) {
    const guest = await this.guestRepository.findOne({ pmsId });

    if (!guest) {
      throw new NotFoundError(Guest, { pmsId });
    }

    return guest;
  }

  async find<P extends string>(opts?: FindOptions<Guest, P>) {
    return this.guestRepository.find(
      { hotels: this.session.hotel },
      {
        populate: opts?.populate,
        orderBy: this.createSortArg(opts?.sort),
        limit: opts?.limit,
        offset: opts?.offset,
      }
    );
  }

  async checkGuestExists({ email }: { email: string }): Promise<boolean> {
    const guest = await this.guestRepository.count({ email });
    return guest > 0;
  }

  async findAnonGuest(deviceId: string) {
    const guest = await this.guestRepository.findOne(
      {
        deviceId,
      },
      { filters: { anon: true } }
    );

    return guest;
  }

  async createAnonGuest({
    deviceId,
    hotelId,
  }: {
    deviceId: string;
    hotelId: string | undefined;
  }) {
    const guest = new Guest();
    guest.deviceId = deviceId;

    if (hotelId) {
      const hotel = await this.hotelService.findOne(hotelId);

      if (!hotel) {
        throw new MissingHeaderError('hotel-id');
      }

      guest.hotels.add(hotel);
    }

    this.deleteAnonGuests(deviceId);

    this.persist(guest);

    return guest;
  }

  async deleteAnonGuests(deviceId: string) {
    const guest = await this.guestRepository.findOne(
      {
        deviceId,
      },
      { filters: { anon: true } }
    );

    if (!guest) {
      return;
    }

    return this.guestRepository.remove(guest);
  }

  async indexOne(
    guest: Guest,
    queryOpts?: Omit<RequestParams.Index, 'index' | 'body' | 'id'>
  ) {
    return this.elasticsearch.indexOne(Guest, guest, queryOpts);
  }

  async indexMany(guests: Guest[]) {
    return this.elasticsearch.indexMany(Guest, guests);
  }

  async search(args: GuestPaginationSearchArgs) {
    const { query, limit, offset, sort, endDate, startDate, anonGuests } = args;

    return this.elasticsearch.searchCollection(Guest, {
      query: {
        bool: {
          must: [
            query
              ? {
                  query_string: {
                    query,
                  },
                }
              : {
                  match_all: {},
                },
            {
              term: {
                'hotels.keyword': this.session.hotel,
              },
            },

            !anonGuests
              ? {
                  exists: {
                    field: 'email',
                  },
                }
              : null,
          ].filter(Boolean),
          must_not: [
            {
              term: {
                deleted: 'true',
              },
            },
          ],
          filter:
            startDate && endDate
              ? {
                  bool: {
                    must: {
                      range: {
                        dateCreated: {
                          gte: dayjs(startDate).format('YYYY-MM-DD'),
                          lt: dayjs(endDate).format('YYYY-MM-DD'),
                        },
                      },
                    },
                  },
                }
              : [],
        },
      },
      sort,
      limit,
      offset,
    });
  }
}
