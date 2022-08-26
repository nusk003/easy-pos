import { __dev__, __sls_offline__, __ws_endpoint__ } from '@src/constants';
import { ApiGatewayManagementApi } from 'aws-sdk';
import { ApiGatewayManagementApiMock } from '@src/websockets/mocks/api-gateway-management-api.mock';
import { EntityManager } from '@mikro-orm/mongodb';
import { MikroORMService, ORM } from './services/mikro-orm.service';
import { ConnectedGuest } from './entities/connected-guest.entity';
import { Hotel } from '@src/modules/hotel/entities';
import { ConnectedUser } from './entities/connected-user.entity';
import { Action } from '@hm/sdk';
import { Guest } from '@src/modules/guest/guest.entity';

export interface Message {
  action: Action;
  data?: Record<string, any>;
  [key: string]: any;
}

export interface WSClientOptions {
  em: EntityManager;
}

export class WSClient {
  ws: ApiGatewayManagementApi;

  endpoint: string;

  orm: ORM;

  em: EntityManager;

  constructor(opts?: WSClientOptions) {
    this.endpoint = __ws_endpoint__;

    this.ws =
      __dev__ && !__sls_offline__
        ? new ApiGatewayManagementApiMock()
        : new ApiGatewayManagementApi({
            apiVersion: '2018-11-29',
            endpoint: this.endpoint,
            region: 'eu-west-2',
          });

    if (!opts?.em) {
      this.orm = new MikroORMService().getORM();
    }

    this.em = opts?.em || <EntityManager>this.orm.em.fork();
  }

  async send(id: string, message: Message) {
    const parsedMessage = JSON.stringify(message);

    return this.ws
      .postToConnection({
        ConnectionId: id,
        Data: parsedMessage,
      })
      .promise();
  }

  private async broadcast(
    connectedUsers: Array<ConnectedGuest | ConnectedUser>,
    message: Message
  ) {
    const promises = connectedUsers.map(async (connectedUser) => {
      try {
        await this.send(connectedUser.connectionId, message);
      } catch (err) {
        if (!__dev__) {
          console.error(err);
        }

        connectedUser.retryAttempts = connectedUser.retryAttempts
          ? connectedUser.retryAttempts + 1
          : 1;

        if (connectedUser.retryAttempts > 4) {
          this.em.remove(connectedUser);
        }
      }
    });

    await Promise.all(promises);

    await this.em.flush();
  }

  async broadcastToGuest(guest: Guest, message: Message) {
    const connectedGuests = await this.em.find(ConnectedGuest, {
      guest,
    });

    await this.broadcast(connectedGuests, message);
  }

  async broadcastToGuests(hotel: Hotel, message: Message) {
    const connectedGuests = await this.em.find(ConnectedGuest, {
      hotel: hotel.id,
    });

    await this.broadcast(connectedGuests, message);
  }

  async broadcastToUsers(hotel: Hotel, message: Message) {
    const connectedUsers = await this.em.find(ConnectedUser, {
      hotel: hotel.id,
    });

    await this.broadcast(connectedUsers, message);
  }

  async broadcastToHotel(hotel: Hotel, message: Message) {
    const connectedUsers = await this.em.find(ConnectedUser, {
      hotel: hotel.id,
    });

    const connectedGuests = await this.em.find(ConnectedGuest, {
      hotel: hotel.id,
    });

    await this.broadcast([...connectedUsers, ...connectedGuests], message);
  }
}
