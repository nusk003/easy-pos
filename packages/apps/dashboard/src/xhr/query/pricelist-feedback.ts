import { queryMap, useSWRListener } from './util';

export const usePricelistFeedback = (pricelistId?: string, fetch = true) => {
  const pricelistFeedbackMap = queryMap.pricelistFeedback(pricelistId);

  const swr = useSWRListener(
    pricelistFeedbackMap.key,
    pricelistId && fetch ? pricelistFeedbackMap.fetcher : null,
    {
      collections: ['order'],
    }
  );
  return swr;
};
