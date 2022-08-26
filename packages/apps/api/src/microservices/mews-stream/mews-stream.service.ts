import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { mikroORMConfig } from '@src/config/mikro-orm.config';
import { __dev__ } from '@src/constants';
import { Hotel, IntegrationProvider } from '@src/modules/hotel/entities';
import { MewsStreamWebsocketSDK } from './mews-stream-websocket.sdk';
import { MewsStreamJWTPayload, MewsStreamSession } from './mews-stream.types';
import { InvalidSessionError, UnauthorizedError, BaseError } from './utils';

let orm: MikroORM<IDatabaseDriver<Connection>>;

let instance: MewsStreamService | undefined = undefined;

export class MewsStreamService {
  wsConnections: MewsStreamWebsocketSDK[] = [];

  session: MewsStreamSession;

  em: EntityManager;

  hotelRepository: EntityRepository<Hotel>;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    this.handleClose = this.handleClose.bind(this);
    this.initConnection = this.initConnection.bind(this);
  }

  static getInstance = () => {
    if (!instance) {
      instance = new MewsStreamService();
    }

    return instance;
  };

  initConnection(hotel: Hotel) {
    return new MewsStreamWebsocketSDK({
      em: this.em,
      hotel,
      handleClose: this.handleClose,
    });
  }

  handleClose(hotel: Hotel) {
    const index = this.wsConnections.findIndex(
      (ws) => ws.hotel.id === hotel.id
    );
    if (index > -1) this.wsConnections[index] = this.initConnection(hotel);
  }

  async init() {
    orm = await MikroORM.init(mikroORMConfig({ debug: !__dev__ }));
    const em = <EntityManager>orm.em.fork();
    this.em = em;
    this.hotelRepository = this.em.getRepository(Hotel);
  }

  async validateJWTPayload(payload: MewsStreamJWTPayload) {
    await this.init();
    const hotel = this.hotelRepository.findOne(payload.hotel);

    if (
      !payload ||
      payload.iss !== 'Hotel Manager' ||
      payload.provider !== IntegrationProvider.Mews
    ) {
      throw new UnauthorizedError(
        'The requested operation failed due to an invalid JWT'
      );
    }

    if (!hotel) {
      throw new InvalidSessionError(
        `The requested operation failed as \`hotel\` had no matching parameter on field \`id\` for value \`${payload.hotel}\``
      );
    }

    this.session = { hotel: payload.hotel, provider: payload.provider };
  }

  async initClients() {
    await this.init();

    const hotels = await this.hotelRepository.findAll();

    for (const hotel of hotels) {
      if (hotel.integrations?.mews)
        this.wsConnections.push(this.initConnection(hotel));
    }
  }

  async addClient() {
    if (!this.session) {
      throw new UnauthorizedError();
    }

    const hotelId = this.session.hotel;

    await this.init();
    const hotel = await this.hotelRepository.findOne(hotelId);

    if (!hotel) {
      throw new InvalidSessionError(
        `The requested operation failed as \`hotel\` had no matching parameter on field \`id\` for value \`${hotelId}\``
      );
    }

    const wsConnection = this.wsConnections.find(
      ({ hotel }) => hotel.id === hotelId
    );

    if (wsConnection) {
      throw new BaseError(
        `The requested operation failed as there is already a connection for \`hotel\` : ${wsConnection.hotel.name}`
      );
    }

    this.wsConnections.push(this.initConnection(hotel));
  }

  deleteClient() {
    if (!this.session) {
      throw new UnauthorizedError();
    }

    const hotelId = this.session.hotel;
    const hotelWSConnections = this.wsConnections.filter(
      (wsConnection) => hotelId === wsConnection.hotel.id
    );
    hotelWSConnections.forEach((wsConnection) => {
      const wsIndex = this.wsConnections.findIndex(
        ({ hotel }) => hotel.id === wsConnection.hotel.id
      );

      if (wsIndex > -1) {
        this.wsConnections[wsIndex].close();
        this.wsConnections.splice(wsIndex, 1);
      } else {
        throw new BaseError(
          `The requested operation failed as there no Mews Stream instance for \`hotel\` with \`id\`: ${hotelId}`
        );
      }
    });
  }
}
