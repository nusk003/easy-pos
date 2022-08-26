import { Message, MessagesQueryVariables } from '@hm/sdk';
import { sdk } from '@src/xhr/graphql-request';
import _ from 'lodash';
import { useSWRInfinite } from 'swr';

export const useMessages = (opts: MessagesQueryVariables, fetch = true) => {
  const getKey = (
    pageIndex: number,
    previousPageData: Array<Message> | null
  ) => {
    if (!fetch) {
      return null;
    }

    const limit = opts.limit || 50;

    if (previousPageData && previousPageData.length < limit) {
      return null;
    }

    const queryKey: MessagesQueryVariables = {
      limit,
      offset: pageIndex * limit,
      threadId: opts.threadId,
      sort: opts.sort,
    };

    return JSON.stringify(queryKey);
  };

  const swr = useSWRInfinite(getKey, {
    fetcher: (key: string) =>
      key && JSON.parse(key).threadId
        ? sdk
            .messages(JSON.parse(key))
            .then((res) => res.messages as unknown as Message[][])
        : [],
    compare: (a, b) => _.isEqual(a?.flat(), b?.flat),
  });

  return swr;
};
