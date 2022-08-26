import { Booking, SearchBookingsQueryVariables, Thread } from '@hm/sdk';
import { sdk } from '@src/xhr/graphql-request';
import _ from 'lodash';
import { useSWRInfiniteListener } from './util';

export const useSearchBookings = (
  opts: SearchBookingsQueryVariables,
  fetch = true
) => {
  const getKey = (
    pageIndex: number,
    previousPageData: Array<Thread> | null
  ) => {
    if (!fetch) {
      return null;
    }

    const limit = opts.limit || 15;

    if (previousPageData && previousPageData.length < limit) {
      return null;
    }

    const queryKey: SearchBookingsQueryVariables = {
      ...opts,
      limit,
      offset: pageIndex * limit,
    };

    return JSON.stringify(queryKey);
  };

  const swr = useSWRInfiniteListener(getKey, {
    compare: (a, b) => _.isEqual(a?.flat(), b?.flat),
    fetcher: (key: string) =>
      sdk
        .searchBookings(JSON.parse(key))
        .then((res) => res.searchBookings.data as unknown as Booking[][]),
    collections: ['booking'],
  });

  return swr;
};
