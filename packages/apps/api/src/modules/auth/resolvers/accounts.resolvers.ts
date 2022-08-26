import {
  Client as GoogleMapsClient,
  PlaceAutocompleteType,
} from '@googlemaps/google-maps-services-js';
import { wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mongodb';
import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { __cloud_console_url__, __google_maps_api_key__ } from '@src/constants';
import { AuthService } from '@src/modules/auth/auth.service';
import {
  CookieName,
  GuestSession,
  UserSession,
} from '@src/modules/auth/auth.types';
import {
  GooglePlacesHotelDetailsArgs,
  GooglePlacesHotelSearchArgs,
  InviteHotelUserArgs,
  RegisterGroupAdminArgs,
  RegisterGuestArgs,
  RegisterHotelUserArgs,
  UserExistsArgs,
} from '@src/modules/auth/dto/auth.args';
import {
  GooglePlaceHotelDetailsResponse,
  GooglePlaceHotelSearchResponse,
  RegisterGroupAdminResponse,
  RegisterGuestResponse,
  RegisterHotelUserResponse,
} from '@src/modules/auth/dto/auth.responses';
import { GuestRole, HotelGuard, UserRole } from '@src/modules/auth/guards';
import { Group } from '@src/modules/group/entities';
import { Guest } from '@src/modules/guest/guest.entity';
import { GuestService } from '@src/modules/guest/guest.service';
import { Hotel } from '@src/modules/hotel/entities';
import { HotelService } from '@src/modules/hotel/hotel.service';
import { Role } from '@src/modules/role/role.entity';
import { User } from '@src/modules/user/user.entity';
import { UserService } from '@src/modules/user/user.service';
import { Ses } from '@src/utils/context';
import { Ctx } from '@src/utils/context/context.decorator';
import { Context } from '@src/utils/context/context.type';
import {
  AuthenticationError,
  BadRequestError,
  ConflictError,
  InternalError,
  MissingHeaderError,
  NotFoundError,
} from '@src/utils/errors';
import { email } from '@src/utils/email/sendgrid';
import currencyCodeLookup from 'iso-country-currency';
import { SDKMutation, SDKQuery } from '@src/utils/gql';

@Resolver()
export class AccountsResolver {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => GuestService))
    private guestService: GuestService,
    private authService: AuthService,
    @Inject(forwardRef(() => HotelService))
    private hotelService: HotelService,
    private em: EntityManager
  ) {}

  @UseGuards(HotelGuard(GuestRole.Identified))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async deleteGuest(@Ctx() context: Context) {
    const session = <GuestSession>context.req.user;

    const guest = await this.guestService.findOne(session.guestId);

    guest.deleted = true;

    this.guestService.persist(guest);
    await this.guestService.flush();
    await this.guestService.indexOne(guest);

    return true;
  }

  @UseGuards(HotelGuard(GuestRole.Anon))
  @Mutation(() => RegisterGuestResponse)
  @SDKMutation(() => RegisterGuestResponse, {
    enum: true,
  })
  async registerGuest(
    @Ctx() context: Context,
    @Args() registerGuestArgs: RegisterGuestArgs
  ): Promise<RegisterGuestResponse> {
    const { email } = registerGuestArgs;

    const session = <GuestSession>context.req.user;
    const authToken = <string>(
      (
        <string>context.req.headers?.['authorization'] ||
        <string>context.req.headers?.['Authorization'] ||
        <string>context.req.cookies?.[CookieName.Guest]
      )?.replace('Bearer ', '')
    );

    const { deviceId } = session;

    let guest: Guest | null;

    try {
      guest = await this.guestService.findOneByEmail(email);

      const { token: verificationToken, expiry: verificationTokenExpiry } =
        this.authService.generateLoginToken();

      wrap(guest).assign({
        deviceId,
        verificationToken,
      });
      guest.verificationTokenExpiry = verificationTokenExpiry;

      const hotelId = <string | undefined>context.req.headers?.['hotel-id'];

      if (!hotelId) {
        throw new MissingHeaderError('hotel-id');
      }

      const hotel = await this.hotelService.findOne(hotelId);

      const key = this.authService.decryptJWT(authToken);
      await this.authService.sendGuestToken(guest, hotel, key);

      this.guestService.persist(guest);
      await this.guestService.flush();
      await this.guestService.indexOne(guest);

      return RegisterGuestResponse.Conflict;
    } catch {
      guest = await this.guestService.findAnonGuest(deviceId);
    }

    if (!guest) {
      throw new NotFoundError(Guest, { deviceId });
    }

    await this.em
      .transactional(async (em) => {
        wrap(guest).assign(registerGuestArgs);
        em.persist(guest!);
        await em.flush();

        await this.guestService.indexOne(guest!);

        await this.authService.authenticateGuest(guest!, context, {
          anonAuth: false,
        });
      })
      .catch((err) => {
        throw new InternalError(err);
      });

    return RegisterGuestResponse.Success;
  }

  @Query(() => [GooglePlaceHotelSearchResponse])
  @SDKQuery(() => [GooglePlaceHotelSearchResponse])
  async googlePlacesHotelSearch(
    @Args() searchForHotelOnGooglePlacesArgs: GooglePlacesHotelSearchArgs
  ): Promise<GooglePlaceHotelSearchResponse[]> {
    const { query, sessionToken } = searchForHotelOnGooglePlacesArgs;

    const googleMapsClient = new GoogleMapsClient();

    const response = await googleMapsClient.placeAutocomplete({
      params: {
        input: query,
        sessiontoken: sessionToken,
        types: PlaceAutocompleteType.establishment,
        key: __google_maps_api_key__,
      },
    });

    const results = response.data.predictions.slice(0, 2).map((result) => {
      return {
        placeId: result.place_id,
        title: result.structured_formatting.main_text,
        description: result.structured_formatting.secondary_text,
      };
    });

    return results;
  }

  @Query(() => GooglePlaceHotelDetailsResponse)
  @SDKQuery(() => GooglePlaceHotelDetailsResponse)
  async googlePlacesHotelDetails(
    @Args() googlePlacesHotelDetailsArgs: GooglePlacesHotelDetailsArgs
  ): Promise<GooglePlaceHotelDetailsResponse> {
    const { placeId, sessionToken } = googlePlacesHotelDetailsArgs;

    const googleMapsClient = new GoogleMapsClient();

    const response = await googleMapsClient.placeDetails({
      params: {
        place_id: placeId,
        sessiontoken: sessionToken,
        key: __google_maps_api_key__,
      },
    });

    const googleResult = response.data.result;

    if (
      !googleResult.address_components ||
      !googleResult.adr_address ||
      !googleResult.name
    ) {
      throw new NotFoundError(Hotel, { placeId });
    }

    const hotelDetails: GooglePlaceHotelDetailsResponse = {
      placeId,
      name: googleResult.name,
      line1: googleResult.name,
      line2: '',
      town: '',
      postalCode: '',
      country: '',
      countryCode: '',
      coordinates: googleResult.geometry!.location,
    };

    googleResult.address_components.map((component) => {
      component.types.map((type: string) => {
        if (type === 'country') {
          hotelDetails.countryCode = component.short_name;
        }
      });
    });

    const addressComponentSchema = /<span class="([^>]*)">(.*?)<\/span>/g;

    let regexGroup;
    do {
      regexGroup = addressComponentSchema.exec(googleResult.adr_address);
      if (regexGroup) {
        switch (regexGroup[1]) {
          case 'street-address':
            hotelDetails.line2 = regexGroup[2];
            break;
          case 'locality':
            hotelDetails.town = regexGroup[2];
            break;
          case 'postal-code':
            hotelDetails.postalCode = regexGroup[2];
            break;
          case 'country-name':
            hotelDetails.country = regexGroup[2];
            break;
          default:
            break;
        }
      }
    } while (regexGroup);

    return hotelDetails;
  }

  @Query(() => Boolean)
  @SDKQuery(() => Boolean)
  async userExists(@Args() userExistsArgs: UserExistsArgs): Promise<boolean> {
    const userExists = this.userService.checkUserExists({
      email: userExistsArgs.where.email,
    });
    return userExists;
  }

  @Mutation(() => RegisterGroupAdminResponse)
  @SDKMutation(() => RegisterGroupAdminResponse)
  async registerGroupAdmin(
    @Ctx() context: Context,
    @Args() registerGroupAdminArgs: RegisterGroupAdminArgs
  ): Promise<RegisterGroupAdminResponse> {
    const {
      group: groupArgs,
      hotel: hotelArgs,
      user: userArgs,
    } = registerGroupAdminArgs;

    const group = new Group(groupArgs);
    const hotel = new Hotel(hotelArgs);
    const user = new User({ ...userArgs, groupAdmin: true });

    hotel.currencyCode = currencyCodeLookup.getParamByISO(
      hotel.countryCode,
      'currency'
    );

    hotel.group = group;
    user.hotels.add(hotel);
    user.group = group;

    if (!groupArgs?.name) {
      group.name = hotel.name;
    }

    const userExists = await this.userService.checkUserExists({
      email: user.email,
    });

    if (userExists) {
      throw new ConflictError(User, { email: user.email });
    }

    await this.em
      .transactional(async (em) => {
        em.persist(group);
        em.persist(hotel);
        em.persist(user);

        await em.flush();
        await this.authService.authenticateUser(user, context);
      })
      .catch((err) => {
        throw new InternalError(err);
      });

    return { user, hotel, group };
  }

  @UseGuards(HotelGuard(UserRole.HotelAdmin))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async inviteHotelUser(
    @Ses() session: UserSession,
    @Args() inviteHotelUserArgs: InviteHotelUserArgs
  ): Promise<boolean> {
    if (!inviteHotelUserArgs.groupAdmin && !inviteHotelUserArgs.hotels) {
      throw new BadRequestError(
        'The requested operation failed as no groupAdmin or hotels field was provided.'
      );
    }

    const user = await this.userService.findOne(session.userId);
    await wrap(user.group).init();
    const userRoles = await user.roles.loadItems();

    const userExists = await this.userService.checkUserExists({
      email: inviteHotelUserArgs.email,
    });

    if (userExists) {
      throw new ConflictError(User, { email: inviteHotelUserArgs.email });
    }

    const inviteUser = new User({
      email: inviteHotelUserArgs.email,
      groupAdmin: inviteHotelUserArgs.groupAdmin,
      group: user.group,
    });

    if (user.group.hotelManager) {
      inviteUser.hotels.add(
        ...(await this.hotelService.repository.find({ group: user.group }))
      );
      inviteUser.groupAdmin = false;
    } else if (inviteUser.groupAdmin) {
      if (!user.groupAdmin) {
        throw new AuthenticationError();
      }
    } else {
      let shouldActivateHotelAdmin = true;

      inviteHotelUserArgs.hotels?.forEach((hotel) => {
        inviteUser.hotels.add(this.hotelService.getReference(hotel.id));

        const inviteRole = new Role();
        inviteRole.hotel = this.hotelService.getReference(hotel.id);
        inviteRole.user = inviteUser;
        inviteRole.role = hotel.role;

        inviteUser.roles.add(inviteRole);

        if (
          userRoles.find((role) => role.hotel.id === hotel.id)?.role !==
          UserRole.HotelAdmin
        ) {
          shouldActivateHotelAdmin = false;
        }
      });

      if (!user.groupAdmin && !shouldActivateHotelAdmin) {
        throw new AuthenticationError();
      }
    }

    inviteUser.disableValidation();
    this.userService.persist(inviteUser);
    await this.userService.flush();

    await email.sendUserInvite({
      to: inviteUser.email!,
      subject: 'Welcome to Hotel Manager',
      data: {
        groupName: user.group.name!,
        inviteEmail: user.email,
        inviteLink: `${__cloud_console_url__}/join/${inviteUser.id}`,
      },
    });

    return true;
  }

  @Mutation(() => RegisterHotelUserResponse)
  @SDKMutation(() => RegisterHotelUserResponse, { enum: true })
  async registerHotelUser(
    @Args() registerHotelUserArgs: RegisterHotelUserArgs,
    @Ctx() context: Context
  ): Promise<RegisterHotelUserResponse> {
    const user = await this.userService.findOne(registerHotelUserArgs.id);

    if (user.firstName) {
      return RegisterHotelUserResponse.Conflict;
    }

    await this.em
      .transactional(async (em) => {
        user.firstName = registerHotelUserArgs.firstName;
        user.lastName = registerHotelUserArgs.lastName;
        user.mobile = registerHotelUserArgs.mobile;

        em.persist(user);
        await em.flush();

        await this.authService.authenticateUser(user, context);
      })
      .catch((err) => {
        throw new InternalError(err);
      });

    return RegisterHotelUserResponse.Success;
  }
}
