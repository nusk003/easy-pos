import { SendPushNotificationArgs } from '@src/microservices/send-push-notifications/dto/send-push-notification-args';
import { IsNumber } from 'class-validator';

export class SendEmailNotificationsArgs extends SendPushNotificationArgs {
  @IsNumber({ maxDecimalPlaces: 0 })
  waitDuration: number;
}
