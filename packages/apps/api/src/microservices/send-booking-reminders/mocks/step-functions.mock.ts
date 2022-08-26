import { handler as sendBookingReminders } from '@src/microservices/send-booking-reminders/send-booking-reminders.handler';
import { SendBookingRemindersArgs } from '@src/microservices/send-booking-reminders/dto/send-booking-reminders.args';
import { mockCallback, mockContext } from '@src/utils/aws';

export interface StepFunctionsMockClassOptions {
  endpoint: string;
}

export interface StartExecutionMockOptions {
  input: string;
}

class StepFunctionsMockClass {
  startExecution({ input }: StartExecutionMockOptions) {
    const sendBookingRemindersArgs: SendBookingRemindersArgs =
      JSON.parse(input);
    const { waitDuration } = sendBookingRemindersArgs;

    return {
      async promise() {
        setTimeout(async () => {
          await sendBookingReminders(
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
