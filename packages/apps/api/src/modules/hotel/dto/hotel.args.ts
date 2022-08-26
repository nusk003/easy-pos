import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Hotel } from '@src/modules/hotel/entities';
import { HotelCustomLink } from '@src/modules/hotel/entities/hotel-custom-link.entity';
import {
  CreateArgsType,
  CreateDeleteArgsType,
  CreateInputType,
  CreateUpdateArgsType,
  CreateUpdateInputType,
  CreateWhereInputType,
} from '@src/utils/dto';
import { Transform, Type } from 'class-transformer';
import { IsMongoId, IsString, ValidateNested } from 'class-validator';

const updateArgFields = <const>[
  'name',
  'telephone',
  'address',
  'website',
  'currencyCode',
  'countryCode',
  'app',
  'payouts',
  'pmsSettings',
  'messagesSettings',
  'bookingsSettings',
];

@ArgsType()
export class GetDomainByHotelIDArgs {
  @IsString()
  @Field()
  domain: string;
}

@InputType()
class UpdateHotelInput extends CreateUpdateInputType(Hotel, updateArgFields) {}

@ArgsType()
export class UpdateHotelArgs {
  @Type(() => UpdateHotelInput)
  @ValidateNested()
  @Field()
  data: UpdateHotelInput;
}

@ArgsType()
export class DeleteHotelArgs extends CreateDeleteArgsType() {}

@ArgsType()
export class CustomDomainArgs {
  @IsString()
  @Field()
  @Transform(({ value }: { value: string }) =>
    value.toLowerCase().replace('http://', '').replace('https://', '').trim()
  )
  domain: string;
}

export type UploadAppAssetFileName = 'icon' | 'featuredImage' | 'featuredLogo';

@ArgsType()
export class AddCustomLinkArgs extends CreateArgsType(HotelCustomLink, [
  'enabled',
  'id',
  'link',
  'name',
  'photo',
]) {}

@InputType()
class UpdateCustomLinkInput extends CreateInputType(HotelCustomLink, [
  'enabled',
  'link',
  'name',
  'photo',
]) {}

@InputType()
class CustomLinkWhereInput extends CreateWhereInputType() {}

@ArgsType()
export class UpdateCustomLinkArgs extends CreateUpdateArgsType(
  CustomLinkWhereInput,
  UpdateCustomLinkInput
) {}

@ArgsType()
export class DeleteCustomLinkArgs extends CreateDeleteArgsType() {}
