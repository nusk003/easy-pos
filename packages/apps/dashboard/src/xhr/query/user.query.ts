import { queryMap, useSWRListener } from './util';

export const useUser = (fetch = true) => {
  const swr = useSWRListener(
    queryMap.user.key,
    fetch ? queryMap.user.fetcher : null,
    { collections: ['user'] }
  );
  return swr;
};
