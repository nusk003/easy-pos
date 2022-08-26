import { queryMap, useSWRListener } from './util';

export const useGuest = (guestId: string | undefined, fetch = true) => {
  const guestMap = queryMap.guest(guestId);

  const swr = useSWRListener(guestMap.key, fetch ? guestMap.fetcher : null, {
    collections: ['guests'],
  });

  return swr;
};
