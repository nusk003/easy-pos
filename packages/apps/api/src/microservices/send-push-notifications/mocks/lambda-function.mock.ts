import { handler as pushNotificationHandler } from '@src/microservices/send-push-notifications/send-push-notifications.handler';
import { mockCallback, mockContext } from '@src/utils/aws';

export interface StartExecutionMockOptions {
  Payload: string;
}

class LambdaFunctionMockClass {
  invoke({ Payload }: StartExecutionMockOptions) {
    const payload = JSON.parse(Payload);

    return {
      promise: async () => {
        pushNotificationHandler(payload, mockContext, mockCallback);
      },
    };
  }
}

export const LambdaFunctionMock = <any>LambdaFunctionMockClass;
