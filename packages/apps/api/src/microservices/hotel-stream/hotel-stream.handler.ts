import { Action } from '@hm/sdk';
import {
  AnyEntity,
  ChangeSet,
  Connection,
  IDatabaseDriver,
  MikroORM,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mongodb';
import { mikroORMConfig } from '@src/config/mikro-orm.config';
import { Guest } from '@src/modules/guest/guest.entity';
import { Hotel } from '@src/modules/hotel/entities';
import { Message, WSClient } from '@src/websockets/websockets.client';
import { Callback, Context } from 'aws-lambda';

export type HotelStreamEvent = {
  Records: [{ Sns: { Message: string } }];
};

let orm: MikroORM<IDatabaseDriver<Connection>>;

class Handler {
  em: EntityManager;

  wsClient: WSClient;

  async init() {
    orm = await MikroORM.init(mikroORMConfig());
    this.em = <EntityManager>orm.em.fork();

    this.wsClient = new WSClient({ em: this.em });
  }

  async hotelStream(
    event: HotelStreamEvent,
    _context: Context,
    _callback: Callback
  ) {
    const changeSet = JSON.parse(event.Records[0].Sns.Message) as ChangeSet<
      AnyEntity<any>
    >[];

    await this.init();

    for await (const diff of changeSet) {
      const hotel =
        diff.collection === 'hotel'
          ? this.em.getReference(Hotel, diff.entity.id)
          : diff.entity.hotel
          ? this.em.getReference(Hotel, diff.entity.hotel)
          : undefined;
      const guest = diff.entity.guest
        ? this.em.getReference(Guest, diff.entity.guest)
        : undefined;

      if (!hotel) {
        continue;
      }

      const message: Message = {
        action: Action.HotelStream,
        data: {
          type: diff.type,
          entity: diff.collection,
        },
      };

      await this.wsClient.broadcastToUsers(hotel, message);

      if (guest) {
        await this.wsClient.broadcastToGuest(guest, message);
      } else {
        await this.wsClient.broadcastToGuests(hotel, message);
      }
    }

    return { statusCode: 200 };
  }
}

const h = new Handler();
export const handler = h.hotelStream.bind(h);
