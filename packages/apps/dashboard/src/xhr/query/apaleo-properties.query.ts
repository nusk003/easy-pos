import useSWR from 'swr';
import { queryMap } from './util';

export const useApaleoProperties = (fetch = true) => {
  const swr = useSWR(
    queryMap.apaleoProperties.key,
    fetch ? queryMap.apaleoProperties.fetcher : null
  );
  return swr;
};
