import _ from 'lodash';
import { useEffect } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import { Fetcher } from 'swr/dist/types';
import { v4 as uuid } from 'uuid';

interface SWRListener {
  fn: () => void;
  key: string;
  collections: string[];
}

class SWRListeners {
  listeners: Record<string, SWRListener> = {};

  addListener(id: string, { key, fn, collections }: SWRListener) {
    this.listeners[id] = { fn, key, collections };
  }

  removeListener(id: string) {
    delete this.listeners[id];
  }

  async mutateCollection(collection: string) {
    const mutations: Record<string, SWRListener> = {};

    Object.values(this.listeners).forEach((listener) => {
      if (listener.collections?.includes(collection)) {
        mutations[listener.key] = listener;
      }
    });

    const promises = Object.values(mutations).map(async (listener) => {
      await listener.fn();
    });

    await Promise.all(promises);
  }
}

export const swrListeners = new SWRListeners();

export const useSWRListener = <Data = any, Error = any>(
  key: string | null,
  fn: Fetcher<Data> | null,
  config: SWRConfiguration<Data, Error, Fetcher<Data>> & {
    collections: string[];
  }
) => {
  const swr = useSWR<Data>(key, fn || null, {
    ...config,
    compare: (a, b) => _.isEqual(a, b),
  });

  useEffect(() => {
    const listenerId = uuid();

    if (key) {
      swrListeners.addListener(listenerId, {
        key: key,
        collections: config.collections,
        fn: swr.mutate,
      });
    }

    return () => {
      swrListeners.removeListener(listenerId);
    };
  }, [config.collections, key, swr.mutate]);

  return swr;
};
