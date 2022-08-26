import { handler as sendWebhook } from '@src/microservices/webhook-service/webhook-service.handler';
import { SendWebhookArgs } from '@src/microservices/webhook-service/dto/webhook-service.args';
import { mockCallback, mockContext } from '@src/utils/aws';

export interface StepFunctionsMockClassOptions {
  endpoint: string;
}

export interface StartExecutionMockOptions {
  input: string;
}

class StepFunctionsMockClass {
  startExecution({ input }: StartExecutionMockOptions) {
    const sendWebhookArgs: SendWebhookArgs = JSON.parse(input);
    const { waitDuration } = sendWebhookArgs;

    return {
      async promise() {
        setTimeout(async () => {
          await sendWebhook(JSON.parse(input), mockContext, mockCallback);
        }, waitDuration * 1000);
      },
    };
  }
}

export const StepFunctionMock = <any>StepFunctionsMockClass;
