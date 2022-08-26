import { SendEmailNotificationsClient } from '@src/microservices/send-email-notifications/send-email-notifications.client';
import { lambdaValidate } from '@src/utils/dto';
import { Callback, Context } from 'aws-lambda';
import {
  CloudConsolePushNotificationsOptions,
  CloudConsoleSendOptions,
  GuestAppPushNotificationsOptions,
  GuestAppSendOptions,
  NotificationPlatform,
  SendPushNotificationArgs,
} from './dto/send-push-notification-args';
import { CloudConsolePushNotificationsService } from './services/cloud-console-push-notifications.service';
import { GuestAppPushNotificationsService } from './services/guest-app-push-notifications.service';

class Handler {
  async sendPushNotification(
    sendPushNotificationArgs: SendPushNotificationArgs,
    _context?: Context,
    _callback?: Callback
  ) {
    const { type, sendOptions, opts } = sendPushNotificationArgs.opts.lambda
      ? await lambdaValidate(SendPushNotificationArgs, sendPushNotificationArgs)
      : sendPushNotificationArgs;

    if (type === NotificationPlatform.CloudConsole) {
      const notificationHandler = new CloudConsolePushNotificationsService(
        <CloudConsolePushNotificationsOptions>opts
      );
      await notificationHandler.send(<CloudConsoleSendOptions>sendOptions);
    }

    if (type === NotificationPlatform.GuestApp) {
      const notificationHandler = new GuestAppPushNotificationsService(
        <GuestAppPushNotificationsOptions>opts
      );
      await notificationHandler.send(<GuestAppSendOptions>sendOptions);
    }

    if (sendOptions.sendEmail) {
      const sendEmailNotificationsClient = new SendEmailNotificationsClient(
        sendPushNotificationArgs
      );

      await sendEmailNotificationsClient.trigger({
        type,
        sendOptions,
        opts,
      });
    }

    return { statusCode: 200 };
  }
}

const h = new Handler();
export const handler = h.sendPushNotification.bind(h);
