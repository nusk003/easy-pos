import { Reference } from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import {
  GuestAppPushNotificationsOptions,
  NotificationPlatform,
} from '@src/microservices/send-push-notifications/dto/send-push-notification-args';
import { SendPushNotificationsClient } from '@src/microservices/send-push-notifications/send-push-notifications.client';
import { GuestSession, UserSession } from '@src/modules/auth/auth.types';
import { Group } from '@src/modules/group/entities';
import { Hotel } from '@src/modules/hotel/entities';
import { Context } from '@src/utils/context/context.type';
import { InternalError } from '@src/utils/errors';
import { BaseService } from '@src/utils/service';
import { WSClient } from '@src/websockets/websockets.client';

export interface TenantServiceOptions {
  guestAppPushNotifications?: GuestAppPushNotificationsOptions;
  em?: EntityManager;
}

export abstract class TenantService<E> extends BaseService<E> {
  context: Context;

  opts?: TenantServiceOptions;

  constructor(
    respository: EntityRepository<E>,
    context: Context,
    opts?: TenantServiceOptions
  ) {
    super(respository);

    this.context = context;

    this.opts = opts;
  }

  get wsClient() {
    if (this.opts?.em) {
      return new WSClient({ em: this.opts?.em });
    }

    throw new InternalError(
      'Unable to get WSClient as opts.em was not specified'
    );
  }

  get guestAppPushNotifications() {
    return new SendPushNotificationsClient(NotificationPlatform.GuestApp, {
      channelId: this.opts?.guestAppPushNotifications?.channelId,
      hotelId: this.hotel,
    });
  }

  get cloudConsolePushNotifications() {
    return new SendPushNotificationsClient(NotificationPlatform.CloudConsole, {
      hotelId: this.hotel,
    });
  }

  get user(): UserSession | GuestSession {
    return <UserSession | GuestSession>this.context.req.user;
  }

  get hotel(): string {
    return this.user.hotel!;
  }

  get group(): string {
    return this.user.group!;
  }

  get hotelReference(): Hotel {
    return Reference.createFromPK(Hotel, this.hotel);
  }

  get groupReference(): Group {
    return Reference.createFromPK(Group, this.group);
  }

  persist(entity: E) {
    const e = <any>entity;
    e.hotel = this.hotelReference;
    e.group = this.groupReference;
    return this.repository.persist(entity);
  }

  async flush() {
    return this.repository.flush();
  }

  async persistAndFlush(entity: E) {
    return this.persist(entity).flush();
  }
}
