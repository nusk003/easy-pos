import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { Guest } from '@src/modules/guest/guest.entity';
import { Hotel } from '@src/modules/hotel/entities';
import { User } from '@src/modules/user/user.entity';
import { ConnectedGuest } from '@src/websockets/entities/connected-guest.entity';
import { ConnectedUser } from '@src/websockets/entities/connected-user.entity';
import {
  AuthService,
  WSGuestSession,
  WSUserSession,
} from '@src/websockets/services/auth.service';
import {
  MikroORMService,
  ORM,
} from '@src/websockets/services/mikro-orm.service';
import { WSClient } from '@src/websockets/websockets.client';
import { Action, WSEvent } from '@hm/sdk';
export class ConnectionsResolver {
  event: WSEvent;

  session: WSGuestSession | WSUserSession;

  orm: ORM;

  em: EntityManager;

  connectedGuestRepository: EntityRepository<ConnectedGuest>;

  connectedUserRepository: EntityRepository<ConnectedUser>;

  hotelRepository: EntityRepository<Hotel>;

  userRepository: EntityRepository<User>;

  guestRepository: EntityRepository<Guest>;

  wsClient: WSClient;

  authService: AuthService;

  constructor(session: WSGuestSession | WSUserSession, event: WSEvent) {
    this.event = event;
    this.session = session;
    this.orm = new MikroORMService().getORM();
    this.em = <EntityManager>this.orm.em.fork();
    this.connectedGuestRepository = this.em.getRepository(ConnectedGuest);
    this.connectedUserRepository = this.em.getRepository(ConnectedUser);
    this.hotelRepository = this.em.getRepository(Hotel);
    this.userRepository = this.em.getRepository(User);
    this.guestRepository = this.em.getRepository(Guest);
    this.wsClient = new WSClient();
    this.authService = new AuthService();
  }

  async connect() {
    if ('guestId' in this.session) {
      const connectedGuest = new ConnectedGuest();
      connectedGuest.connectionId = this.event.requestContext.connectionId;
      connectedGuest.hotel = this.hotelRepository.getReference(
        this.session.hotel!
      );
      connectedGuest.guest = this.guestRepository.getReference(
        this.session.guestId
      );

      await this.connectedGuestRepository.persist(connectedGuest).flush();
    } else if ('userId' in this.session) {
      const connectedUser = new ConnectedUser();
      connectedUser.connectionId = this.event.requestContext.connectionId;
      connectedUser.hotel = this.hotelRepository.getReference(
        this.session.hotel!
      );
      connectedUser.user = this.userRepository.getReference(
        this.session.userId
      );
      await this.connectedUserRepository.persist(connectedUser).flush();
    }
  }

  async disconnect() {
    if ('guestId' in this.session) {
      const guests = await this.connectedGuestRepository.find({
        connectionId: this.session.connectionId,
      });
      guests.forEach((guest) => {
        this.connectedGuestRepository.remove(guest);
      });
      await this.connectedGuestRepository.flush();
    } else if ('userId' in this.session) {
      const users = await this.connectedUserRepository.find({
        connectionId: this.session.connectionId,
      });
      users.forEach((user) => {
        this.connectedUserRepository.remove(user);
      });
      await this.connectedUserRepository.flush();
    }

    await this.authService.deleteSession(this.event);
  }

  async pingPong() {
    const { token } = this.event.body;

    await this.wsClient.send(this.event.requestContext.connectionId, {
      action: Action.Pong,
      token,
    });

    if ('guestId' in this.session) {
      let connectedGuest = await this.connectedGuestRepository.findOne({
        connectionId: this.event.requestContext.connectionId,
      });

      if (connectedGuest) {
        return;
      }

      connectedGuest = new ConnectedGuest();

      connectedGuest.connectionId = this.event.requestContext.connectionId;
      connectedGuest.hotel = this.hotelRepository.getReference(
        this.session.hotel!
      );
      connectedGuest.guest = this.guestRepository.getReference(
        this.session.guestId
      );

      await this.connectedGuestRepository.persist(connectedGuest).flush();
    } else if ('userId' in this.session) {
      let connectedUser = await this.connectedUserRepository.findOne({
        connectionId: this.event.requestContext.connectionId,
      });

      if (connectedUser) {
        return;
      }

      connectedUser = new ConnectedUser();

      connectedUser.connectionId = this.event.requestContext.connectionId;
      connectedUser.hotel = this.hotelRepository.getReference(
        this.session.hotel!
      );
      connectedUser.user = this.userRepository.getReference(
        this.session.userId
      );
      await this.connectedUserRepository.persist(connectedUser).flush();
    }
  }

  async default() {
    await this.wsClient.send(this.event.requestContext.connectionId, {
      action: Action.Default,
      data: { message: `${this.event.body.action} does not exist` },
    });
  }
}
