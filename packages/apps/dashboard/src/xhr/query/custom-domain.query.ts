import { queryMap, useSWRListener } from './util';

export const useCustomDomain = (fetch = true) => {
  const { key, fetcher } = queryMap.customDomain;

  const swr = useSWRListener(key, fetch ? fetcher : null, {
    collections: ['hotel'],
  });
  return swr;
};
