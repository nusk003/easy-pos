import _ from 'lodash';
import { OrdersQueryVariables } from '@hm/sdk';
import { queryMap, useSWRListener } from './util';

export const useOrders = (opts: OrdersQueryVariables = {}, fetch = true) => {
  const orderMap = queryMap.orders(opts);

  const swr = useSWRListener(orderMap.key, fetch ? orderMap.fetcher : null, {
    collections: ['order'],
    compare: (a, b) => _.isEqual(a, b),
  });
  return swr;
};
