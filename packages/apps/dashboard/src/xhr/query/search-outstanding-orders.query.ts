import {
  Order,
  PaymentType,
  SearchOutstandingOrdersQueryVariables,
} from '@hm/sdk';
import { useSWRInfinite } from 'swr';
import { sdk } from '@src/xhr/graphql-request';
import _ from 'lodash';
import { useState } from 'react';

export const useSearchOutstandingOrders = (
  opts: SearchOutstandingOrdersQueryVariables,
  fetch = true
) => {
  const [count, mutateCount] = useState(0);

  const getKey = (pageIndex: number, previousPageData: Array<Order> | null) => {
    if (!fetch) {
      return null;
    }

    const limit = opts.limit || 15;

    if (previousPageData && previousPageData.length < limit) {
      return null;
    }

    const queryKey: SearchOutstandingOrdersQueryVariables = {
      paymentType: opts?.paymentType,
      limit,
      offset: pageIndex * limit,
      guestId: opts?.guestId,
      query: opts?.query,
    };

    return JSON.stringify(queryKey);
  };

  const swr = useSWRInfinite(getKey, {
    compare: (a, b) => _.isEqual(a?.flat?.(), b?.flat?.()),
    fetcher: (key: string) => {
      const queryVariables = JSON.parse(key);
      queryVariables.paymentType =
        queryVariables.paymentType === 'cash'
          ? PaymentType.Cash
          : PaymentType.RoomBill;
      return sdk.searchOutstandingOrders(JSON.parse(key)).then((res) => {
        const result = res.searchOutstandingOrders;
        mutateCount(result.count);
        return result.data as unknown as Order[][];
      });
    },
  });

  return { ...swr, count, mutateCount };
};
