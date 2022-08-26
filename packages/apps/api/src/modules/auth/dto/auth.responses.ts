import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Coordinates } from '@src/modules/attraction/attraction.entity';
import { Group } from '@src/modules/group/entities';
import { Hotel } from '@src/modules/hotel/entities';
import { User } from '@src/modules/user/user.entity';
import { SDKField } from '@src/utils/gql';

export enum AccessTokenGrantLevel {
  User = 'User',
  Hotel = 'Hotel',
}
registerEnumType(AccessTokenGrantLevel, { name: 'AccessTokenGrantLevel' });

@ObjectType()
export class GooglePlaceHotelSearchResponse {
  @Field()
  @SDKField()
  placeId: string;

  @Field()
  @SDKField()
  title: string;

  @Field()
  @SDKField()
  description: string;
}

@ObjectType()
export class GooglePlaceHotelDetailsResponse {
  @Field()
  @SDKField()
  placeId: string;

  @Field()
  @SDKField()
  name: string;

  @Field()
  @SDKField()
  line1: string;

  @Field()
  @SDKField()
  line2: string;

  @Field()
  @SDKField()
  town: string;

  @Field()
  @SDKField()
  postalCode: string;

  @Field()
  @SDKField()
  country: string;

  @Field()
  @SDKField()
  countryCode: string;

  @Field(() => Coordinates)
  @SDKField()
  coordinates: Coordinates;
}

export enum RegisterGuestResponse {
  Success,
  Conflict,
}
registerEnumType(RegisterGuestResponse, { name: 'RegisterGuestResponse' });

export enum RegisterHotelUserResponse {
  Success,
  Conflict,
}
registerEnumType(RegisterHotelUserResponse, {
  name: 'RegisterHotelUserResponse',
});

@ObjectType()
export class RegisterGroupAdminResponse {
  @Field()
  @SDKField(() => User, {
    fields: [
      'id',
      'dateCreated',
      'dateUpdated',
      'email',
      'firstName',
      'lastName',
      'mobile',
      'jobTitle',
      'groupAdmin',
      'hotelManager',
    ],
  })
  user: User;

  @Field()
  @SDKField(() => Hotel, { fields: ['id'] })
  hotel: Hotel;

  @Field()
  @SDKField(() => Group, { fields: ['id'] })
  group: Group;
}

@ObjectType()
export class GetUserLoginTokenResponse {
  @Field()
  @SDKField()
  loginLink: string;
}

@ObjectType()
export class ConnectMarketplaceAppResponse {
  @Field()
  @SDKField()
  redirectURL: string;
}

@ObjectType()
export class GetAccessTokenResponse {
  @Field()
  @SDKField()
  accessToken: string;

  @Field()
  @SDKField()
  refreshToken: string;

  @Field()
  @SDKField()
  ttl: number;

  @Field(() => [AccessTokenGrantLevel])
  @SDKField(() => String)
  grantLevel: AccessTokenGrantLevel[];
}
