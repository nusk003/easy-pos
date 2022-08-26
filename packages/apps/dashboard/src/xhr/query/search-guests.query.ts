import { SearchOrdersQueryVariables } from '@hm/sdk';
import { queryMap, useSWRListener } from './util';

export const useSearchGuests = (
  opts: SearchOrdersQueryVariables,
  fetch = true
) => {
  const guestMap = queryMap.searchGuests({ ...opts, limit: 7 });

  const swr = useSWRListener(guestMap.key, fetch ? guestMap.fetcher : null, {
    collections: ['guest'],
  });

  return swr;
};
