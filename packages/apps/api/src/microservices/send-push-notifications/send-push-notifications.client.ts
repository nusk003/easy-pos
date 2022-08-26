import { __dev__, __sls_offline__, __stage__ } from '@src/constants';
import { handler as pushNotificationHandler } from '@src/microservices/send-push-notifications/send-push-notifications.handler';
import AWS from 'aws-sdk';
import {
  ClientGuestAppSendOptions,
  ClientSendOptionsArgs,
  CloudConsolePushNotificationsOptions,
  GuestAppPushNotificationsOptions,
  GuestAppSendOptions,
  NotificationPlatform,
  SendOptionsArgs,
  SendPushNotificationArgs,
} from './dto/send-push-notification-args';
import { LambdaFunctionMock } from './mocks/lambda-function.mock';

export class SendPushNotificationsClient {
  lambda: AWS.Lambda;

  type: NotificationPlatform;

  opts: CloudConsolePushNotificationsOptions | GuestAppPushNotificationsOptions;

  hotel: string;

  setHotel(hotel: string) {
    this.hotel = hotel;
  }

  constructor(
    type: NotificationPlatform,
    opts:
      | CloudConsolePushNotificationsOptions
      | GuestAppPushNotificationsOptions
  ) {
    this.type = type;
    this.opts = opts;

    if (__dev__) {
      if (!__sls_offline__) {
        this.lambda = new LambdaFunctionMock();
      } else {
        this.lambda = new AWS.Lambda({
          endpoint: 'http://localhost:3002',
          region: 'eu-west-2',
          maxRetries: 0,
        });
      }
    } else {
      this.lambda = new AWS.Lambda({ maxRetries: 0, region: 'eu-west-2' });
    }
  }

  async trigger(sendOptionsArgs: ClientSendOptionsArgs) {
    this.opts.hotelId = this.opts.hotelId || this.hotel;

    if (!this.opts.hotelId) {
      throw new Error('SendPushNotificationClient: No hotel ID was set');
    }

    const sendOptions: SendOptionsArgs = sendOptionsArgs;
    sendOptions.sendEmail =
      sendOptions.sendEmail === undefined || sendOptions.sendEmail;

    if ('guest' in sendOptionsArgs) {
      const { guest } = sendOptionsArgs;

      (<GuestAppSendOptions>sendOptions).email = guest.email;

      const hotelTokens = guest?.pushNotifications?.find(
        (pn) => String(pn.hotel) === String(this.opts.hotelId)
      );

      (<GuestAppSendOptions>sendOptions).to = hotelTokens?.tokens;

      delete (<Partial<ClientGuestAppSendOptions>>sendOptionsArgs).guest;
    }

    const sendPushNotificationArgs: SendPushNotificationArgs = {
      opts: this.opts,
      sendOptions,
      type: this.type,
    };

    if (
      sendOptionsArgs.lambda === false ||
      (this.opts.lambda === false && sendOptionsArgs.lambda !== true)
    ) {
      await pushNotificationHandler(sendPushNotificationArgs);
      return;
    }

    await this.lambda
      .invoke({
        FunctionName: `hotel-manager-api-${__stage__}-send-push-notifications`,
        Payload: JSON.stringify(sendPushNotificationArgs),
        InvocationType: 'Event',
      })
      .promise();
  }
}
