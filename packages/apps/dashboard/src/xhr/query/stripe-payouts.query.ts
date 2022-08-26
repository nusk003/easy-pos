import useSWR from 'swr';
import { queryMap } from './util';

export const useStripePayouts = (fetch = true) => {
  const swr = useSWR(
    queryMap.stripePayouts.key,
    fetch ? queryMap.stripePayouts.fetcher : null
  );
  return swr;
};
