import { __dev__, __sls_offline__ } from '@src/constants';
import AWS from 'aws-sdk';
import { SendBookingRemindersArgs } from './dto/send-booking-reminders.args';
import { StepFunctionMock } from './mocks/step-functions.mock';

export class SendBookingRemindersClient {
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

  async trigger(sendBookingRemindersArgs: SendBookingRemindersArgs) {
    const stateMachineArn = `arn:aws:states:${process.env.STAGE}:${process.env.AWS_ACCOUNT_ID}:stateMachine:${process.env.STAGE}-send-booking-reminders-sm`;

    await this.stepFunctions
      .startExecution({
        stateMachineArn,
        input: JSON.stringify(sendBookingRemindersArgs),
      })
      .promise();
  }
}
