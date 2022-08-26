import { __dev__, __sls_offline__ } from '@src/constants';
import AWS from 'aws-sdk';
import { AutoProgressOrderArgs } from './dto/auto-progress-order.args';
import { StepFunctionMock } from './mocks/step-functions.mock';

export class AutoProgressOrderClient {
  stepFunctions: AWS.StepFunctions;

  constructor() {
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
  }

  async trigger(autoProgressOrderArgs: AutoProgressOrderArgs) {
    const stateMachineArn = `arn:aws:states:${process.env.STAGE}:${process.env.AWS_ACCOUNT_ID}:stateMachine:${process.env.STAGE}-auto-progress-order-sm`;

    await this.stepFunctions
      .startExecution({
        stateMachineArn,
        input: JSON.stringify(autoProgressOrderArgs),
      })
      .promise();
  }
}
