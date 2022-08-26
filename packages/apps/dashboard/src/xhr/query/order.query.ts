import { queryMap, useSWRListener } from './util';

export const useOrder = (orderId?: string, fetch = true) => {
  const orderMap = queryMap.order(orderId);

  const swr = useSWRListener(
    orderMap.key,
    fetch && orderId ? orderMap.fetcher : null,
    {
      collections: ['order'],
    }
  );

  return swr;
};
