import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { Guest } from '@src/modules/guest/guest.entity';
import { Hotel } from '@src/modules/hotel/entities';
import { ObjectId } from 'mongodb';

@Entity({ collection: 'connected-guest' })
export class ConnectedGuest {
  @PrimaryKey()
  _id: ObjectId;

  @SerializedPrimaryKey()
  @PrimaryKey()
  id: string;

  @Property()
  connectionId: string;

  @Property({ nullable: true })
  retryAttempts: number;

  @ManyToOne(() => Guest)
  guest: Guest;

  @ManyToOne(() => Hotel)
  hotel: Hotel;

  @Property({ type: Date })
  dateCreated = new Date();

  @Property({ type: Date, onUpdate: () => new Date() })
  dateUpdated = new Date();
}
