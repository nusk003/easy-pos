import useSWR from 'swr';
import { queryMap } from './util';

export const useMewsServices = (fetch = true) => {
  const swr = useSWR(
    queryMap.mewsServices.key,
    fetch ? queryMap.mewsServices.fetcher : null
  );
  return swr;
};
