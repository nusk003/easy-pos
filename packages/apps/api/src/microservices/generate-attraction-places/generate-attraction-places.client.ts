import { __dev__, __sls_offline__, __stage__ } from '@src/constants';
import { GenerateAttractionPlacesArgs } from '@src/modules/attraction/dto/attraction.args';
import AWS from 'aws-sdk';

import { LambdaFunctionMock } from './mocks/lambda-function.mock';

export class GenerateAttractionPlacesClient {
  lambda: AWS.Lambda;

  constructor() {
    if (__dev__) {
      if (!__sls_offline__) {
        this.lambda = new LambdaFunctionMock();
      } else {
        this.lambda = new AWS.Lambda({
          endpoint: 'http://localhost:3002',
          region: 'eu-west-2',
          maxRetries: 0,
        });
      }
    } else {
      this.lambda = new AWS.Lambda({ maxRetries: 0, region: 'eu-west-2' });
    }
  }

  async trigger(generatePlaceArgs: GenerateAttractionPlacesArgs) {
    await this.lambda
      .invoke({
        FunctionName: `hotel-manager-api-${__stage__}-generate-attraction-places`,
        Payload: JSON.stringify(generatePlaceArgs),
        InvocationType: 'Event',
      })
      .promise();
  }
}
