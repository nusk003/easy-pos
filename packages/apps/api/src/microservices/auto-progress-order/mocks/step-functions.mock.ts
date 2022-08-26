import { handler as autoProgressOrder } from '@src/microservices/auto-progress-order/auto-progress-order.handler';
import { AutoProgressOrderArgs } from '@src/microservices/auto-progress-order/dto/auto-progress-order.args';
import { mockCallback, mockContext } from '@src/utils/aws';

export interface StepFunctionsMockClassOptions {
  endpoint: string;
}

export interface StartExecutionMockOptions {
  input: string;
}

class StepFunctionsMockClass {
  startExecution({ input }: StartExecutionMockOptions) {
    const autoProgressOrderArgs: AutoProgressOrderArgs = JSON.parse(input);
    const { waitDuration } = autoProgressOrderArgs;

    return {
      async promise() {
        setTimeout(async () => {
          await autoProgressOrder(JSON.parse(input), mockContext, mockCallback);
        }, waitDuration * 1000);
      },
    };
  }
}

export const StepFunctionMock = <any>StepFunctionsMockClass;
