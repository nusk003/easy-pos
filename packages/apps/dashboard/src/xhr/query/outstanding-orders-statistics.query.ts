import { queryMap, useSWRListener } from './util';

export const useOutstandingOrdersStatistics = (fetch = true) => {
  const swr = useSWRListener(
    queryMap.outstandingOrdersStatistics.key,
    fetch ? queryMap.outstandingOrdersStatistics.fetcher : null,
    {
      collections: ['order'],
    }
  );
  return swr;
};
