import { ExecutionContext, Injectable, mixin } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { __demo_group_id__, __hm_group_id__ } from '@src/constants';
import {
  AccessTokenSession,
  GuestSession,
  RefreshTokenSession,
  UserSession,
} from '@src/modules/auth/auth.types';
import { Hotel } from '@src/modules/hotel/entities';
import { HotelService } from '@src/modules/hotel/hotel.service';
import { UserRole } from '@src/modules/role/role.entity';
import { UserService } from '@src/modules/user/user.service';
import { Context } from '@src/utils/context/context.type';
import { AuthenticationError, MissingHeaderError } from '@src/utils/errors';
import { FastifyRequest } from 'fastify';
import { AuthGuardJWT } from './util/auth-guard-jwt';

export { UserRole };

export enum GuestRole {
  Identified,
  Anon,
  NoHotel,
}

export enum ConnectRole {
  AccessToken,
}

export const HotelGuard = (
  ...roles: Array<UserRole | GuestRole | ConnectRole>
) => {
  function checkRoles(...args: typeof roles) {
    return args.some((el) => roles.includes(el));
  }

  @Injectable()
  class HotelGuardMixin extends AuthGuardJWT {
    constructor(
      private readonly userService: UserService,
      private readonly hotelService: HotelService
    ) {
      super();
    }

    getContext(context: ExecutionContext) {
      return GqlExecutionContext.create(context).getContext();
    }

    getRequest(ctx: ExecutionContext): FastifyRequest {
      const context = this.getContext(ctx);
      return context.req;
    }

    async handleRequest(
      err: unknown,
      session: UserSession | GuestSession | AccessTokenSession,
      _info: unknown,
      ctx: ExecutionContext
    ) {
      if (err) {
        throw new AuthenticationError();
      }

      if ((<RefreshTokenSession>session)?.refreshToken) {
        throw new AuthenticationError();
      }

      try {
        let shouldActivate = false;
        let hotelId: string | undefined;
        let groupId: string | undefined;

        const context = <Context>this.getContext(ctx);
        const request = context.req;

        if (session) {
          hotelId =
            'accessToken' in session
              ? session.hotel
              : <string>request.headers['hotel-id'];

          let hotel: Hotel | undefined;

          if (hotelId) {
            hotel = await this.hotelService.findOne(hotelId);
          }

          groupId = hotel?.group.id;

          if ('accessToken' in session) {
            if (!hotelId) {
              throw new MissingHeaderError('hotel-id');
            }

            if (
              checkRoles(ConnectRole.AccessToken) &&
              hotel?.integrations?.marketplaceApps?.find(
                (app) => app.id.toString() === session.marketplaceId
              )
            ) {
              shouldActivate = true;
            }
          } else if (
            'userId' in session &&
            checkRoles(
              UserRole.GroupAdmin,
              UserRole.HotelAdmin,
              UserRole.HotelMember,
              UserRole.SuperAdmin
            )
          ) {
            if (!hotelId) {
              throw new MissingHeaderError('hotel-id');
            }

            if (!hotel) {
              throw new AuthenticationError();
            }

            const user = await this.userService.findOne(session.userId);

            if (user.group.id === __hm_group_id__) {
              shouldActivate = true;
            } else if (user.group.id === __demo_group_id__) {
              if (hotel.group.id === __hm_group_id__) {
                shouldActivate = true;
              }
            } else if (user.group.id === hotel.group.id) {
              if (user.groupAdmin) {
                shouldActivate = true;
              } else if (checkRoles(UserRole.HotelMember)) {
                shouldActivate = true;
              } else if (checkRoles(UserRole.HotelAdmin)) {
                const roles = await user.roles.loadItems();

                const hotelRole = roles.find((r) => r.hotel.id === hotel!.id);

                if (hotelRole?.role === UserRole.HotelAdmin) {
                  shouldActivate = true;
                }
              }
            }
          } else if (
            'guestId' in session &&
            checkRoles(GuestRole.Anon, GuestRole.Identified, GuestRole.NoHotel)
          ) {
            if (checkRoles(GuestRole.NoHotel)) {
              shouldActivate = true;
            } else if (checkRoles(GuestRole.Anon) && session.anonAuth) {
              shouldActivate = true;
            } else if (!session.anonAuth) {
              shouldActivate = true;
            }
          }
        }

        if (!shouldActivate) {
          throw new AuthenticationError();
        }

        const userSession = { ...session, hotel: hotelId!, group: groupId! };

        return userSession;
      } catch (err) {
        console.error(err);
        throw new AuthenticationError();
      }
    }
  }

  const guard = mixin(HotelGuardMixin);
  return guard;
};
