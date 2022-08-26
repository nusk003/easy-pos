import { SearchOrdersQueryVariables } from '@hm/sdk';
import { queryMap, useSWRListener } from './util';

export const useSearchOrders = (
  opts: SearchOrdersQueryVariables,
  fetch = true
) => {
  const ordersMap = queryMap.searchOrders({ ...opts, limit: 6 });

  const swr = useSWRListener(ordersMap.key, fetch ? ordersMap.fetcher : null, {
    collections: ['order'],
  });

  return swr;
};
