import useSWR from 'swr';
import { queryMap } from './util';

export const useOmnivoreLocations = (fetch = true) => {
  const swr = useSWR(
    queryMap.omnivoreLocations.key,
    fetch ? queryMap.omnivoreLocations.fetcher : null
  );
  return swr;
};
