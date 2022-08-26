import { ChangeSet, AnyEntity } from '@mikro-orm/core';
import {
  __aws_account_id__,
  __dev__,
  __sls_offline__,
  __stage__,
} from '@src/constants';
import AWS from 'aws-sdk';
import { SNSMock } from './mocks/sns.mock';

export class HotelStreamClient {
  sns: AWS.SNS;

  constructor() {
    if (__dev__) {
      if (!__sls_offline__) {
        this.sns = new SNSMock();
      } else {
        this.sns = new AWS.SNS({
          endpoint: 'http://127.0.0.1:5002',
          region: 'eu-west-2',
        });
      }
    } else {
      this.sns = new AWS.SNS({
        region: 'eu-west-2',
      });
    }
  }

  async trigger(message: ChangeSet<AnyEntity<any>>[]) {
    const SNSMessage = {
      default: JSON.stringify(message),
    };

    await this.sns
      .publish({
        Message: JSON.stringify(SNSMessage),
        MessageStructure: 'json',
        TopicArn: `arn:aws:sns:eu-west-2:${__aws_account_id__}:${__stage__}-hotel-stream`,
      })
      .promise();
  }
}
