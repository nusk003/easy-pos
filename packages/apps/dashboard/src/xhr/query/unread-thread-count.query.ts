import useSWR from 'swr';
import { queryMap } from './util';

export const useUnreadThreadCount = (fetch = true) => {
  const swr = useSWR(
    queryMap.unreadThreadCount.key,
    fetch ? queryMap.unreadThreadCount.fetcher : null
  );
  return swr;
};
