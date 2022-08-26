import { wrap } from '@mikro-orm/core';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileManagementService } from '@src/libs/filemanagement/file-management.service';
import { AssetType } from '@src/libs/filemanagement/file-management.types';
import { GuestRole, HotelGuard } from '@src/modules/auth/guards';
import { UserRole } from '@src/modules/role/role.entity';
import { GuestSession, Ses, UserSession } from '@src/utils/context';
import {
  BadRequestError,
  InvalidSessionError,
  NotFoundError,
} from '@src/utils/errors';
import { SDKMutation, SDKQuery } from '@src/utils/gql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import {
  AddCustomLinkArgs,
  CustomDomainArgs,
  DeleteCustomLinkArgs,
  GetDomainByHotelIDArgs,
  UpdateCustomLinkArgs,
  UpdateHotelArgs,
} from './dto/hotel.args';
import { GetCustomDomainResponse } from './dto/hotel.responses';
import { Hotel, HotelAppAssets } from './entities';
import { HotelCustomLink } from './entities/hotel-custom-link.entity';
import { HotelService } from './hotel.service';

@Resolver()
export class HotelResolver {
  constructor(
    private readonly hotelService: HotelService,
    private readonly fileManagementService: FileManagementService
  ) {}

  @Query(() => String, { name: 'hotelIDByDomain' })
  @SDKQuery(() => String, { name: 'hotelIDByDomain' })
  async getHotelIDByDomain(
    @Args() getDomainByHotelIDArgs: GetDomainByHotelIDArgs
  ): Promise<string> {
    const hotelID = await this.hotelService.findHotelIDByDomain(
      getDomainByHotelIDArgs.domain
    );
    return hotelID;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember, GuestRole.Anon))
  @Query(() => Hotel, { name: 'hotel' })
  @SDKQuery(() => Hotel, { name: 'hotel' })
  async getHotel(@Ses() session: UserSession | GuestSession): Promise<Hotel> {
    const hotelId = session.hotel!;

    if (!hotelId) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelService.findOne(hotelId);
    await wrap(hotel.group).init();

    return hotel;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Hotel)
  @SDKMutation(() => Hotel)
  async updateHotel(
    @Args() updateHotelArgs: UpdateHotelArgs,
    @Ses() session: UserSession
  ): Promise<Hotel> {
    const hotelId = session.hotel!;

    if (!hotelId) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelService.update(
      { id: hotelId },
      updateHotelArgs.data
    );
    await wrap(hotel.group).init();

    await this.hotelService.flush();
    return hotel;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => GetCustomDomainResponse, {
    name: 'customDomain',
    nullable: true,
  })
  @SDKQuery(() => GetCustomDomainResponse, { name: 'customDomain' })
  async getCustomDomain(
    @Ses() session: UserSession
  ): Promise<GetCustomDomainResponse> {
    const hotelId = session.hotel!;

    if (!hotelId) {
      throw new InvalidSessionError('hotel');
    }

    const data = await this.hotelService.getCustomDomain();

    return data;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async addCustomDomain(
    @Args() customDomainArgs: CustomDomainArgs,
    @Ses() session: UserSession
  ): Promise<boolean> {
    const hotelId = session.hotel!;

    if (!hotelId) {
      throw new InvalidSessionError('hotel');
    }

    await this.hotelService.addCustomDomain(customDomainArgs.domain);
    await this.hotelService.flush();

    return true;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async deleteCustomDomain(@Ses() session: UserSession): Promise<boolean> {
    const hotelId = session.hotel!;

    if (!hotelId) {
      throw new InvalidSessionError('hotel');
    }

    await this.hotelService.deleteCustomDomain();
    await this.hotelService.flush();

    return true;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => HotelCustomLink)
  @SDKMutation(() => HotelCustomLink)
  async addCustomLink(
    @Args() addCustomLinkArgs: AddCustomLinkArgs,
    @Ses() session: UserSession | GuestSession
  ): Promise<HotelCustomLink> {
    const hotelId = session.hotel!;

    if (!hotelId) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelService.findOne(hotelId);

    let s3ObjectLink: string | undefined = undefined;

    if (addCustomLinkArgs.photo) {
      const buffer = Buffer.from(
        addCustomLinkArgs.photo.replace(/^data:image\/\w+;base64,/, ''),
        'base64'
      );

      s3ObjectLink = await this.fileManagementService.uploadAsset(
        AssetType.CustomLinkAssets,
        buffer,
        addCustomLinkArgs.id,
        undefined,
        {
          ContentEncoding: 'base64',
          ContentType: 'image/png',
        }
      );
    }

    const customLink = { ...addCustomLinkArgs, photo: s3ObjectLink };

    if (!hotel.customLinks) {
      hotel.customLinks = [];
    }

    hotel.customLinks.push(customLink);

    await this.hotelService.flush();

    return customLink;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => HotelCustomLink)
  @SDKMutation(() => HotelCustomLink)
  async updateCustomLink(
    @Args() updateCustomLinkArgs: UpdateCustomLinkArgs,
    @Ses() session: UserSession | GuestSession
  ): Promise<HotelCustomLink> {
    const hotelId = session.hotel!;

    if (!hotelId) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelService.findOne(hotelId);

    const customLinkIndex = hotel.customLinks?.findIndex(
      (c) => c.id === updateCustomLinkArgs.where.id
    );

    if (
      !hotel.customLinks ||
      customLinkIndex === undefined ||
      customLinkIndex < -1
    ) {
      throw new NotFoundError(Hotel, {
        'customLink.id': updateCustomLinkArgs.where.id,
      });
    }

    const customLink = hotel.customLinks[customLinkIndex];

    let s3ObjectLink: string | undefined = customLink.photo;

    if (updateCustomLinkArgs.data.photo) {
      const buffer = Buffer.from(
        updateCustomLinkArgs.data.photo.replace(/^data:image\/\w+;base64,/, ''),
        'base64'
      );

      s3ObjectLink = await this.fileManagementService.uploadAsset(
        AssetType.CustomLinkAssets,
        buffer,
        updateCustomLinkArgs.where.id,
        customLink.photo,
        {
          ContentEncoding: 'base64',
          ContentType: 'image/png',
        }
      );
    }

    hotel.customLinks[customLinkIndex] = {
      id: updateCustomLinkArgs.where.id,
      ...updateCustomLinkArgs.data,
      photo: s3ObjectLink,
    };

    await this.hotelService.flush();

    return hotel.customLinks[customLinkIndex];
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async deleteCustomLink(
    @Args() deleteCustomLinkArgs: DeleteCustomLinkArgs,
    @Ses() session: UserSession | GuestSession
  ): Promise<boolean> {
    const hotelId = session.hotel!;

    if (!hotelId) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelService.findOne(hotelId);

    const customLinkIndex = hotel.customLinks?.findIndex(
      (c) => c.id === deleteCustomLinkArgs.where.id
    );

    if (
      !hotel.customLinks ||
      customLinkIndex === undefined ||
      customLinkIndex < -1
    ) {
      throw new NotFoundError(Hotel, {
        'customLink.id': deleteCustomLinkArgs.where.id,
      });
    }

    const customLink = hotel.customLinks[customLinkIndex];

    if (customLink.photo) {
      await this.fileManagementService.deleteAsset(customLink.photo);
    }

    hotel.customLinks.splice(customLinkIndex, 1);

    await this.hotelService.flush();

    return true;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Boolean)
  @SDKMutation(() => Boolean)
  async uploadAppAsset(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename }: FileUpload,
    @Ses() session: UserSession | GuestSession
  ): Promise<boolean> {
    const hotelId = session.hotel!;

    if (!hotelId) {
      throw new InvalidSessionError('hotel');
    }

    const hotel = await this.hotelService.findOne(hotelId);

    filename = filename.split('.')[0];

    if (
      filename !== 'icon' &&
      filename !== 'featuredImage' &&
      filename !== 'featuredLogo'
    ) {
      throw new BadRequestError(
        'The requested operation failed as the filename of the form data was invalid.'
      );
    }

    let previousKey: string | undefined;

    if (filename === 'icon') {
      previousKey = hotel.app?.metadata?.icon;
    } else {
      previousKey = hotel.app?.assets?.[<keyof HotelAppAssets>filename];
    }

    const assetType =
      filename === 'icon' ? AssetType.BuildAssets : AssetType.LiveAssets;

    const s3ObjectLink = await this.fileManagementService.uploadAsset(
      assetType,
      createReadStream(),
      filename,
      previousKey
    );

    if (!hotel.app) {
      hotel.app = { metadata: {}, assets: {} };
    }

    if (!hotel.app.metadata) {
      hotel.app.metadata = {};
    }

    if (!hotel.app.assets) {
      hotel.app.assets = {};
    }

    if (filename === 'icon') {
      hotel.app.metadata!.icon = s3ObjectLink;
    } else {
      hotel.app.assets![<keyof HotelAppAssets>filename] = s3ObjectLink;
    }

    await this.hotelService.flush();

    return true;
  }
}
