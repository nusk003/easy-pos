import { BookingsQueryVariables } from '@hm/sdk';
import { queryMap, useSWRListener } from './util';

export const useBookings = (
  opts: BookingsQueryVariables = {},
  fetch = true
) => {
  const bookingsMap = queryMap.bookings(opts);

  const swr = useSWRListener(
    bookingsMap.key,
    fetch ? bookingsMap.fetcher : null,
    {
      collections: ['booking', 'guest'],
    }
  );
  return swr;
};
