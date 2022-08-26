import { queryMap, useSWRListener } from './util';

export const useOmnivoreOptions = (
  locationId: string | undefined,
  fetch = true
) => {
  const omnivoreOptionsMap = queryMap.omnivoreOptions(locationId);

  const swr = useSWRListener(
    omnivoreOptionsMap.key,
    fetch && locationId ? omnivoreOptionsMap.fetcher : null,
    {
      collections: ['group'],
    }
  );

  return swr;
};
