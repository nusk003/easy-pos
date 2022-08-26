import { SearchSalesQueryVariables } from '@hm/sdk';
import { queryMap, useSWRListener } from './util';

export const useSearchSales = (
  opts: SearchSalesQueryVariables,
  fetch = true
) => {
  const ordersMap = queryMap.searchSales({ ...opts, limit: 6 });

  const swr = useSWRListener(ordersMap.key, fetch ? ordersMap.fetcher : null, {
    collections: ['sale'],
  });

  return swr;
};
