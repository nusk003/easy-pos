import { useEffect } from 'react';
import { KeyLoader, SWRInfiniteConfiguration, useSWRInfinite } from 'swr';
import { v4 as uuid } from 'uuid';
import { swrListeners } from './use-swr-listener.hook';

export const useSWRInfiniteListener = <Data = any, Error = any>(
  key: KeyLoader,
  {
    collections,
    ...config
  }: SWRInfiniteConfiguration<Data, Error> & {
    collections: string[];
  }
) => {
  const swr = useSWRInfinite<Data>(key as KeyLoader, {
    ...config,
  });

  useEffect(() => {
    const listenerId = uuid();

    if (key) {
      swrListeners.addListener(listenerId, {
        key: key(0, null) as string,
        collections: collections,
        fn: swr.mutate,
      });
    }

    return () => {
      swrListeners.removeListener(listenerId);
    };
  }, [collections, key, swr.mutate]);

  return swr;
};
