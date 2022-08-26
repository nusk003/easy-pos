import useSWR from 'swr';
import { queryMap } from './util';

export const useStripeAccount = (fetch = true) => {
  const swr = useSWR(
    queryMap.stripeAccount.key,
    fetch ? queryMap.stripeAccount.fetcher : null
  );
  return swr;
};
