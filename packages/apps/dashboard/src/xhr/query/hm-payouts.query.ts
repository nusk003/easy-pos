import { queryMap, useSWRListener } from './util';

export const useHMPayPayouts = (fetch = true) => {
  const swr = useSWRListener(
    queryMap.hmPayPayouts.key,
    fetch ? queryMap.hmPayPayouts.fetcher : null,
    {
      collections: ['hotel'],
    }
  );
  return swr;
};
