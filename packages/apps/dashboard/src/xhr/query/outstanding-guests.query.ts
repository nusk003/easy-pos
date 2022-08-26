import {
  OutstandingGuest,
  OutstandingGuestsQueryVariables,
  PaymentType,
} from '@hm/sdk';
import { useSWRInfinite } from 'swr';
import { sdk } from '@src/xhr/graphql-request';

export const useOutstandingGuests = (
  opts: OutstandingGuestsQueryVariables,
  fetch = true
) => {
  const getKey = (
    pageIndex: number,
    previousPageData: Array<OutstandingGuest> | null
  ) => {
    if (!fetch) {
      return null;
    }

    const limit = opts.limit || 15;

    if (previousPageData && previousPageData.length < limit) {
      return null;
    }

    const queryKey: OutstandingGuestsQueryVariables = {
      paymentType:
        opts?.paymentType === PaymentType.RoomBill
          ? PaymentType.RoomBill
          : PaymentType.Cash,
      limit,
      offset: pageIndex * limit,
      sort: opts.sort,
    };

    return JSON.stringify(queryKey);
  };

  const swr = useSWRInfinite(getKey, {
    fetcher: (key: string) =>
      sdk
        .outstandingGuests(JSON.parse(key))
        .then(
          (res) => res.outstandingGuests.data as unknown as OutstandingGuest[][]
        ),
  });

  return swr;
};
