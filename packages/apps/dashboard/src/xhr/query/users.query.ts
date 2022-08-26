import { queryMap, useSWRListener } from './util';

export const useUsers = (fetch = true) => {
  const swr = useSWRListener(
    queryMap.users.key,
    fetch ? queryMap.users.fetcher : null,
    {
      collections: ['user'],
    }
  );
  return swr;
};
