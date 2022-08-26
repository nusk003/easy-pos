import { useStore } from '@src/store';
import { useCallback } from 'react';
import { queryMap, useSWRListener } from './util';

export const useHotel = (fetch = true) => {
  const { loggedIn } = useStore(
    useCallback(
      (state) => ({
        loggedIn: state.loggedIn,
      }),
      []
    )
  );

  const swr = useSWRListener(
    queryMap.hotel.key,
    fetch && loggedIn ? queryMap.hotel.fetcher : null,
    {
      collections: ['hotel'],
    }
  );
  return swr;
};
