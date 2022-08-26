import { Populate } from '@mikro-orm/core/typings';

export interface FindOptions<T, P extends string = ''> {
  populate?: Populate<T, P>;
  sort?: any;
  limit?: number;
  offset?: number;
}
