import useSWR from 'swr';
import { queryMap } from './util';

export const useOmnivoreDiscounts = (
  locationId: string | undefined,
  fetch = true
) => {
  const omnivoreDiscountsMap = queryMap.omnivoreDiscounts(locationId);

  const swr = useSWR(
    omnivoreDiscountsMap.key,
    fetch && locationId ? omnivoreDiscountsMap.fetcher : null
  );

  return swr;
};
