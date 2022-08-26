import {
  GuestAppPushNotificationsOptions,
  GuestAppSendOptions,
} from '@src/microservices/send-push-notifications/dto/send-push-notification-args';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

const expo = new Expo();

export class GuestAppPushNotificationsService {
  channelId?: GuestAppPushNotificationsOptions['channelId'];

  constructor(opts?: GuestAppPushNotificationsOptions) {
    this.channelId = opts?.channelId;
  }

  async send(opts: GuestAppSendOptions) {
    if (!opts.to?.length) {
      return;
    }

    const message: ExpoPushMessage = {
      ...opts,
      to: opts.to!,
      sound: 'default',
    };

    if (this.channelId) {
      message.channelId = this.channelId;
    }

    await expo.sendPushNotificationsAsync([message]);
  }
}
