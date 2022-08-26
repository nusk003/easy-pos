import { SearchProductsQueryVariables } from '@hm/sdk';
import { queryMap, useSWRListener } from './util';

export const useSearchProducts = (
  opts: SearchProductsQueryVariables,
  fetch = true
) => {
  const guestMap = queryMap.searchProducts({ ...opts, limit: 7 });

  const swr = useSWRListener(guestMap.key, fetch ? guestMap.fetcher : null, {
    collections: ['product'],
  });

  return swr;
};
