import { queryMap, useSWRListener } from './util';

export const useAttraction = (fetch = true, enableHotelStream = true) => {
  const swr = useSWRListener(
    queryMap.attraction.key,
    fetch ? queryMap.attraction.fetcher : null,
    { collections: fetch && enableHotelStream ? ['attraction'] : [] }
  );
  return swr;
};
