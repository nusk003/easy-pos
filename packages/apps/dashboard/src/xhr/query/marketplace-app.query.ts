import { MarketplaceAppQueryVariables } from '@hm/sdk';
import useSWR from 'swr';
import { queryMap } from './util';

export const useMarketplaceApp = (
  opts: MarketplaceAppQueryVariables,
  fetch = true
) => {
  const marketplaceAppMap = queryMap.marketplaceApp(opts);
  const swr = useSWR(
    marketplaceAppMap.key,
    fetch ? marketplaceAppMap.fetcher : null
  );
  return swr;
};
