import { wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import {
  __fly_api_app_id__,
  __fly_api_endpoint__,
  __fly_api_key__,
} from '@src/constants';
import { Context, GuestSession, UserSession } from '@src/utils/context';
import { NotFoundError } from '@src/utils/errors';
import { BaseService } from '@src/utils/service';
import { gql } from 'apollo-server-core';
import { GraphQLClient } from 'graphql-request';
import { ObjectId } from 'mongodb';
import { Hotel, HotelDomain } from './entities';

@Injectable({ scope: Scope.REQUEST })
export class HotelService extends BaseService<Hotel> {
  private flyApiClient = new GraphQLClient(__fly_api_endpoint__, {
    headers: {
      authorization: 'Bearer ' + __fly_api_key__,
    },
  });

  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: EntityRepository<Hotel>,
    @InjectRepository(HotelDomain)
    private readonly hotelDomainsRepository: EntityRepository<HotelDomain>,
    @Inject(CONTEXT) private context: Context
  ) {
    super(hotelRepository);
  }

  get session() {
    return <GuestSession | UserSession>this.context.req.user;
  }

  async findAll() {
    const hotels = this.hotelRepository.findAll();
    return hotels;
  }

  async findOne(id: string) {
    const hotel = await this.hotelRepository.findOne(id, {
      cache: 1000,
    });

    if (!hotel) {
      throw new NotFoundError(Hotel, { id });
    }

    return hotel;
  }

  async findHotelIDByDomain(domain: string) {
    const response = await this.hotelDomainsRepository.findOne({ domain });

    if (!response) {
      throw new HttpException(
        `The requested operation falied as \`hotel_domains\` had no matching parameter on field \`domain\` for value \`${domain}\`.`,
        HttpStatus.NOT_FOUND
      );
    }

    return String(response.hotel);
  }

  async findByGroupID(groupId?: string) {
    const hotels = await this.hotelRepository.find({
      group: groupId || this.session.group,
    });
    return hotels;
  }

  async findByPMSIntegrationID(pmsId: string) {
    return this.hotelRepository.findOne(
      { pmsSettings: { pmsId } },
      { populate: ['group'] }
    );
  }

  async delete(id: string) {
    return this.update({ id }, { deleted: true });
  }

  async update(where: { id: string }, data: Partial<Hotel>) {
    const hotel = await this.findOne(where.id);

    let shouldMerge = true;

    if (data.messagesSettings) {
      shouldMerge = false;
    }

    if (data.bookingsSettings) {
      shouldMerge = false;
    }

    if (data.pmsSettings) {
      shouldMerge = false;
    }

    wrap(hotel).assign(
      data,
      shouldMerge ? { merge: true, mergeObjects: true } : { merge: false }
    );

    this.persist(hotel);
    return hotel;
  }

  async getCustomDomain() {
    const hotel = await this.findOne(this.session.hotel!);

    if (!hotel.app?.domain) {
      return null;
    }

    const query = gql`
      query ($appId: String!, $hostname: String!) {
        app(name: $appId) {
          certificate(hostname: $hostname) {
            configured
            acmeDnsConfigured
            acmeAlpnConfigured
            certificateAuthority
            createdAt
            dnsProvider
            dnsValidationInstructions
            dnsValidationHostname
            dnsValidationTarget
            hostname
            id
            source
            clientStatus
            issued {
              nodes {
                type
                expiresAt
              }
            }
          }
        }
      }
    `;

    const data = await this.flyApiClient.request(query, {
      appId: __fly_api_app_id__,
      hostname: hotel.app.domain,
    });

    return {
      ...data.app.certificate,
      domain: hotel.app.domain,
    };
  }

  async addCustomDomain(domain: string) {
    const hotel = await this.findOne(this.session.hotel!);
    let hotelDomain = await this.hotelDomainsRepository.findOne({
      domain: hotel.app?.domain,
    });

    const existingDomain = hotel.app?.domain;

    if (hotel.app?.domain && domain !== existingDomain) {
      const query = gql`
        mutation ($appId: ID!, $hostname: String!) {
          deleteCertificate(appId: $appId, hostname: $hostname) {
            app {
              name
            }
            certificate {
              hostname
              id
            }
          }
        }
      `;

      await this.flyApiClient.request(query, {
        appId: __fly_api_app_id__,
        hostname: existingDomain,
      });

      delete hotel.app?.domain;
    }

    if (!hotel.app?.domain) {
      const query = gql`
        mutation ($appId: ID!, $hostname: String!) {
          addCertificate(appId: $appId, hostname: $hostname) {
            certificate {
              configured
              acmeDnsConfigured
              acmeAlpnConfigured
              certificateAuthority
              certificateRequestedAt
              dnsProvider
              dnsValidationInstructions
              dnsValidationHostname
              dnsValidationTarget
              hostname
              id
              source
            }
          }
        }
      `;

      await this.flyApiClient.request(query, {
        appId: __fly_api_app_id__,
        hostname: domain,
      });
    }

    if (!hotelDomain) {
      hotelDomain = new HotelDomain();
      hotelDomain.hotel = new ObjectId(this.session.hotel!);
    }

    hotelDomain.domain = domain;
    this.hotelDomainsRepository.persist(hotelDomain);

    if (!hotel.app) {
      hotel.app = {};
    }
    hotel.app.domain = domain;
    this.persist(hotel);

    return hotel;
  }

  async deleteCustomDomain() {
    const hotel = await this.findOne(this.session.hotel!);

    if (!hotel.app?.domain) {
      throw new NotFoundError(Hotel, { 'app.domain': undefined });
    }

    const hotelDomain = await this.hotelDomainsRepository.findOne({
      hotel: new ObjectId(this.session.hotel),
    });

    if (!hotelDomain) {
      throw new NotFoundError(HotelDomain, {
        hotel: this.session.hotel,
      });
    }

    const query = gql`
      mutation ($appId: ID!, $hostname: String!) {
        deleteCertificate(appId: $appId, hostname: $hostname) {
          app {
            name
          }
          certificate {
            hostname
            id
          }
        }
      }
    `;

    await this.flyApiClient.request(query, {
      appId: __fly_api_app_id__,
      hostname: hotel.app.domain,
    });

    delete hotel.app.domain;
    this.persist(hotel);
    this.hotelDomainsRepository.remove(hotelDomain);

    return true;
  }
}
