import { __dev__, __prod__, __sls_offline__ } from '@src/constants';
import {
  NotificationPlatform,
  SendPushNotificationArgs,
} from '@src/microservices/send-push-notifications/dto/send-push-notification-args';
import AWS from 'aws-sdk';
import { SendEmailNotificationsArgs } from './dto/send-email-notifications.args';
import { StepFunctionMock } from './mocks/step-functions.mock';
import { Action } from '@hm/sdk';

export class SendEmailNotificationsClient {
  stepFunctions: AWS.StepFunctions;

  type: SendPushNotificationArgs['type'];

  sendOptions: SendPushNotificationArgs['sendOptions'];

  constructor(sendPushNotificationArgs: SendPushNotificationArgs) {
    if (__dev__) {
      if (!__sls_offline__) {
        this.stepFunctions = new StepFunctionMock();
      } else {
        this.stepFunctions = new AWS.StepFunctions({
          endpoint: 'http://localhost:5003',
        });
      }
    } else {
      this.stepFunctions = new AWS.StepFunctions({ region: 'eu-west-2' });
    }

    this.type = sendPushNotificationArgs.type;
    this.sendOptions = sendPushNotificationArgs.sendOptions;
  }

  async trigger(
    sendEmailNotificationsArgs: Omit<SendEmailNotificationsArgs, 'waitDuration'>
  ) {
    const stateMachineArn = `arn:aws:states:${process.env.STAGE}:${process.env.AWS_ACCOUNT_ID}:stateMachine:${process.env.STAGE}-send-email-notifications-sm`;

    let waitDuration = -1;

    if (this.sendOptions.data?.action === Action.UpdateOrder) {
      if (this.type === NotificationPlatform.GuestApp) {
        waitDuration = 0;
      }
    } else if (this.sendOptions.data?.action === Action.NewMessage) {
      if (this.type === NotificationPlatform.GuestApp) {
        waitDuration = 300;
      }
    } else if (
      this.sendOptions.data?.action === Action.NewBooking ||
      this.sendOptions.data?.action === Action.SubmitBooking ||
      this.sendOptions.data?.action === Action.ReviewBooking
    ) {
      if (this.type === NotificationPlatform.GuestApp) {
        waitDuration = 0;
      }
    }

    if (!__prod__ && !__sls_offline__ && waitDuration > -1) {
      waitDuration = waitDuration > 0 ? 5 : waitDuration;
    }

    if (waitDuration === -1) {
      return;
    }

    await this.stepFunctions
      .startExecution({
        stateMachineArn,
        input: JSON.stringify({ ...sendEmailNotificationsArgs, waitDuration }),
      })
      .promise();
  }
}
