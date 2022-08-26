import { queryMap, useSWRListener } from './util';

export const useThread = (threadId: string, fetch = true) => {
  const threadMap = queryMap.thread(threadId);

  const swr = useSWRListener(
    threadMap.key,
    threadId && fetch ? threadMap.fetcher : null,
    {
      collections: ['thread'],
    }
  );
  return swr;
};
