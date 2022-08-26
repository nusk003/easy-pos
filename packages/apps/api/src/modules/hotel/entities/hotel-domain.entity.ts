import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
  Unique,
} from '@mikro-orm/core';
import { IsURL } from '@src/utils/class-validation';
import { ObjectId } from 'mongodb';

@Entity({ tableName: 'hotel_domain' })
export class HotelDomain {
  @PrimaryKey()
  _id: ObjectId;

  @SerializedPrimaryKey()
  id: string;

  @Property()
  @IsURL()
  @Unique()
  domain: string;

  @Property()
  @Unique()
  hotel: ObjectId;
}
