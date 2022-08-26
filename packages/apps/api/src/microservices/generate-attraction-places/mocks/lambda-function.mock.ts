import { handler as generateAttractionPlaces } from '@src/microservices/generate-attraction-places/generate-attraction-places.handler';
import { mockCallback, mockContext } from '@src/utils/aws';

export interface StartExecutionMockOptions {
  Payload: string;
}

class LambdaFunctionMockClass {
  invoke({ Payload }: StartExecutionMockOptions) {
    const payload = JSON.parse(Payload);

    return {
      promise: async () => {
        generateAttractionPlaces(payload, mockContext, mockCallback);
      },
    };
  }
}

export const LambdaFunctionMock = <any>LambdaFunctionMockClass;
