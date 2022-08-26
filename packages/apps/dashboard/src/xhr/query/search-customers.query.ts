import { queryMap, useSWRListener } from './util';
import { SearchCustomersQueryVariables } from '@hm/sdk';

export const useSearchCustomers = (
  opts: SearchCustomersQueryVariables,
  fetch = true
) => {
  const guestMap = queryMap.searchCustomers({ ...opts, limit: 7 });

  const swr = useSWRListener(guestMap.key, fetch ? guestMap.fetcher : null, {
    collections: ['customer'],
  });

  return swr;
};
