import { Guest } from '@src/modules/guest/guest.entity';
import { Action } from '@hm/sdk';
import { ExpoPushMessage } from 'expo-server-sdk';

interface PushNotificationsOptions {
  hotelId?: string;
  lambda?: boolean;
}

export interface GuestAppPushNotificationsOptions
  extends PushNotificationsOptions {
  channelId?: ExpoPushMessage['channelId'];
}

export interface GuestAppSendOptions extends Omit<ExpoPushMessage, 'to'> {
  sendEmail?: boolean;
  to: string[] | undefined;
  email: string | undefined;
  data?: {
    action: Action;
    data: Record<string, any>;
  };
}

export interface ClientGuestAppSendOptions extends Omit<ExpoPushMessage, 'to'> {
  sendEmail?: boolean;
  guest: Guest;
  data?: {
    action: Action;
    data: Record<string, any>;
  };
}

export interface CloudConsoleSendOptions {
  sendEmail?: boolean;
  data?: {
    action: Action;
    data: Record<string, any>;
  };
}

export interface CloudConsolePushNotificationsOptions
  extends PushNotificationsOptions {
  hotelId: string;
}

export enum NotificationPlatform {
  CloudConsole = 'CloudConsole',
  GuestApp = 'GuestApp',
}

export type ClientSendOptionsArgs =
  | (ClientGuestAppSendOptions & { lambda?: boolean })
  | (CloudConsoleSendOptions & { lambda?: boolean });

export type SendOptionsArgs = GuestAppSendOptions | CloudConsoleSendOptions;

export class SendPushNotificationArgs {
  type: NotificationPlatform;
  sendOptions: SendOptionsArgs;
  opts: GuestAppPushNotificationsOptions | CloudConsolePushNotificationsOptions;
}
