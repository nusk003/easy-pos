import { queryMap, useSWRListener } from './util';

export const useSpaces = (fetch = true) => {
  const swr = useSWRListener(
    queryMap.spaces.key,
    fetch ? queryMap.spaces.fetcher : null,
    {
      collections: ['space', 'pricelist'],
    }
  );
  return swr;
};
