import { PaginationSort, Thread, ThreadsQueryVariables } from '@hm/sdk';
import { sdk } from '@src/xhr/graphql-request';
import _ from 'lodash';
import { queryMap, useSWRInfiniteListener, useSWRListener } from './util';

export const useThreadsInfinite = (
  opts: ThreadsQueryVariables,
  fetch = true
) => {
  const getKey = (
    pageIndex: number,
    previousPageData: Array<Thread> | null
  ) => {
    if (!fetch) {
      return null;
    }

    const limit = opts.limit || 15;

    if (previousPageData && previousPageData.length < limit) {
      return null;
    }

    const queryKey: ThreadsQueryVariables = {
      limit,
      offset: pageIndex * limit,
      resolved: opts.resolved,
      sort: { dateUpdated: PaginationSort.Desc },
    };

    return JSON.stringify(queryKey);
  };

  const swr = useSWRInfiniteListener(getKey, {
    compare: (a, b) => _.isEqual(a?.flat(), b?.flat),
    fetcher: (key: string) =>
      sdk
        .threads(JSON.parse(key))
        .then((res) => res.threads as unknown as Thread[][]),
    collections: ['thread'],
  });

  return swr;
};

export const useThreads = (opts: ThreadsQueryVariables = {}, fetch = true) => {
  const threadMap = queryMap.threads(opts);

  const swr = useSWRListener(threadMap.key, fetch ? threadMap.fetcher : null, {
    collections: ['thread'],
    compare: (a, b) => _.isEqual(a, b),
  });
  return swr;
};
