import { EntityManager } from '@mikro-orm/mongodb';
import {
  __api_url__,
  __jwt_secret__,
  __mews_websocket_address__,
} from '@src/constants';
import { Hotel, IntegrationProvider } from '@src/modules/hotel/entities';
import {
  MewsEventType,
  MewsSubscriptionEvent,
  MewsSubscriptionPayload,
} from '@src/modules/integrations/types';
import { log } from '@src/utils/log';
import axios from 'axios';
import { sign } from 'jsonwebtoken';
import WebSocket from 'ws';

interface MewsStreamWebsocketSDKOpts {
  em: EntityManager;
  hotel: Hotel;
  handleClose: (hotel: Hotel) => void;
}

export class MewsStreamWebsocketSDK extends WebSocket {
  em: EntityManager;

  hotel: Hotel;

  handleClose: (hotel: Hotel) => void;

  timeout: ReturnType<typeof setTimeout>;

  pingInterval: ReturnType<typeof setInterval>;

  constructor({ em, hotel, handleClose }: MewsStreamWebsocketSDKOpts) {
    const clientToken = hotel.integrations?.mews?.clientToken;
    const accessToken = hotel.integrations?.mews?.accessToken;

    super(
      `${__mews_websocket_address__}/ws/connector?ClientToken=${clientToken}&AccessToken=${accessToken}`
    );

    this.em = em;
    this.hotel = hotel;
    this.handleClose = handleClose;

    this.onopen = this.onOpen.bind(this);

    this.onclose = this.onClose.bind(this);

    this.onmessage = this.onMessage.bind(this);

    this.pingInterval = setInterval(() => {
      this.send('ping');
      log.info('ws-stream', `Pinging  ${this.hotel.id} (${this.hotel.name})`);
      this.timeout = setTimeout(() => this.close(), 1000 * 2);
    }, 1000 * 60 * 5);
  }

  async handleReservationEvents(
    mewsSubscriptionPayload: MewsSubscriptionPayload
  ) {
    const token = sign(
      {
        iss: 'Hotel Manager',
        id: IntegrationProvider.Mews,
        hotel: this.hotel.id,
      },
      __jwt_secret__
    );
    const url = `${__api_url__}/integrations/subscriptions/${token}`;
    await axios.post(url, mewsSubscriptionPayload);
  }

  onOpen() {
    log.info(
      'ws-stream',
      `Hotel ${this.hotel.id} (${this.hotel.name}) connected to mews successfully`
    );
  }

  onClose() {
    log.info(
      'ws-stream',
      `Hotel ${this.hotel.id} (${this.hotel.name}) disconnected from mews successfully`
    );
    clearInterval(this.pingInterval);
    this.handleClose(this.hotel);
  }

  async onMessage({ data }: WebSocket.MessageEvent) {
    log.info('ws-stream', data);
    const events: MewsSubscriptionEvent[] = JSON.parse(<string>data).Events;
    if (events === null) {
      log.info('ws-stream', `Hotel ${this.hotel.name} sent pong`);
      clearTimeout(this.timeout);
      return;
    }

    const reservationEvents = events.filter(
      ({ Type }) => Type === MewsEventType.Reservation
    );

    if (reservationEvents.length && reservationEvents.length > 0) {
      const reservationEventsPayload = {
        Events: reservationEvents,
      };

      await this.handleReservationEvents(reservationEventsPayload);
    }
  }
}
