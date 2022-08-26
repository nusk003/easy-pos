import { queryMap, useSWRListener } from './util';

export const useSale = (saleId?: string, fetch = true) => {
  const saleMap = queryMap.sale(saleId);

  const swr = useSWRListener(
    saleMap.key,
    fetch && saleId ? saleMap.fetcher : null,
    {
      collections: ['sale'],
    }
  );

  return swr;
};
