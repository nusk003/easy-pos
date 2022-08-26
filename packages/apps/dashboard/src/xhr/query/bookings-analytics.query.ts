import { BookingAnalyticsQueryVariables } from '@hm/sdk';
import { queryMap, useSWRListener } from './util';

export const useBookingsAnalytics = (
  opts: BookingAnalyticsQueryVariables,
  fetch = true
) => {
  const { key, fetcher } = queryMap.bookingAnalytics(opts);

  const swr = useSWRListener(key, fetch ? fetcher : null, {
    collections: ['booking'],
  });
  return swr;
};
