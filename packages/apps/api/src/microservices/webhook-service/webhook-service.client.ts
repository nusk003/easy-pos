import { Action } from '@hm/sdk';
import { wrap } from '@mikro-orm/core';
import { __dev__, __sls_offline__ } from '@src/constants';
import AWS from 'aws-sdk';
import _ from 'lodash';
import {
  SendWebhookArgs,
  WebhookEntity,
  WebhookPayloadEntity,
} from './dto/webhook-service.args';
import { StepFunctionMock } from './mocks/step-functions.mock';

export class WebhookServiceClient {
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

  async trigger(sendWebhookArgs: SendWebhookArgs) {
    const stateMachineArn = `arn:aws:states:${process.env.STAGE}:${process.env.AWS_ACCOUNT_ID}:stateMachine:${process.env.STAGE}-webhook-service-sm`;

    await this.stepFunctions
      .startExecution({
        stateMachineArn,
        input: JSON.stringify(sendWebhookArgs),
      })
      .promise();
  }

  mapEntity(entity: WebhookEntity) {
    return {
      ...wrap(entity).toJSON(),
      ...('status' in entity ? { status: entity.status } : undefined),
      __entityName: _.capitalize(entity.constructor.name),
    } as unknown as WebhookPayloadEntity;
  }

  async triggerWebhooks(
    entities: WebhookEntity | WebhookEntity[],
    action: Action
  ) {
    try {
      let payloadEntities = <WebhookPayloadEntity[]>entities;

      if (Array.isArray(entities)) {
        payloadEntities = entities.map((entity) => this.mapEntity(entity));
      } else {
        payloadEntities = [this.mapEntity(entities)];
      }

      await this.trigger({
        retryAttempts: 2,
        waitDuration: 0,
        action,
        entities: payloadEntities,
      });
    } catch (err) {
      console.error(err);
      return;
    }
  }
}
