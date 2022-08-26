import { MarketplaceAppsQueryVariables } from '@hm/sdk';
import useSWR from 'swr';
import { queryMap } from './util';

export const useMarketplaceApps = (
  opts?: MarketplaceAppsQueryVariables,
  fetch = true
) => {
  const marketplaceAppsMap = queryMap.marketplaceApps(opts);

  const swr = useSWR(
    marketplaceAppsMap.key,
    fetch ? marketplaceAppsMap.fetcher : null
  );
  return swr;
};
