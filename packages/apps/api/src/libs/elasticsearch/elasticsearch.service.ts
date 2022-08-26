import { Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { Context } from '@src/utils/context';
import { ElasticClient } from './elasticsearch.client';

@Injectable({ scope: Scope.REQUEST })
export class ElasticsearchService extends ElasticClient {
  constructor(@Inject(CONTEXT) context: Context) {
    super(context);
  }
}
