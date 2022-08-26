import { mockCallback, mockContext } from '@src/utils/aws';
import AWS from 'aws-sdk';
import { handler as hotelStream } from '@src/microservices/hotel-stream/hotel-stream.handler';

class SNSMockClass {
  publish(params: AWS.SNS.Types.PublishInput) {
    hotelStream(
      {
        Records: [
          {
            Sns: {
              Message: JSON.parse(params.Message).default,
            },
          },
        ],
      },
      mockContext,
      mockCallback
    );

    return {
      promise: () => Promise.resolve(),
    };
  }
}

export const SNSMock = <any>SNSMockClass;
