import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { Hotel } from '@src/modules/hotel/entities';
import { User } from '@src/modules/user/user.entity';
import { ObjectId } from 'mongodb';

@Entity({ collection: 'connected-user' })
export class ConnectedUser {
  @PrimaryKey()
  _id: ObjectId;

  @SerializedPrimaryKey()
  @PrimaryKey()
  id: string;

  @Property()
  connectionId: string;

  @Property({ nullable: true })
  retryAttempts?: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Hotel)
  hotel: Hotel;

  @Property({ type: Date })
  dateCreated = new Date();

  @Property({ type: Date, onUpdate: () => new Date() })
  dateUpdated = new Date();
}
