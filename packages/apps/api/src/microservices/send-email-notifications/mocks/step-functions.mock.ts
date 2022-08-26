import { handler as sendEmailNotifications } from '@src/microservices/send-email-notifications/send-email-notifications.handler';
import { SendEmailNotificationsArgs } from '@src/microservices/send-email-notifications/dto/send-email-notifications.args';
import { mockCallback, mockContext } from '@src/utils/aws';

export interface StepFunctionsMockClassOptions {
  endpoint: string;
}

export interface StartExecutionMockOptions {
  input: string;
}

class StepFunctionsMockClass {
  startExecution({ input }: StartExecutionMockOptions) {
    const sendEmailNotificationsArgs: SendEmailNotificationsArgs =
      JSON.parse(input);
    const { waitDuration } = sendEmailNotificationsArgs;

    return {
      async promise() {
        setTimeout(async () => {
          await sendEmailNotifications(
            JSON.parse(input),
            mockContext,
            mockCallback
          );
        }, waitDuration * 1000);
      },
    };
  }
}

export const StepFunctionMock = <any>StepFunctionsMockClass;
