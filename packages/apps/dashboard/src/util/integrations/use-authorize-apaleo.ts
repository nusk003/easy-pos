import { toast } from '@src/components/atoms';
import { useStore } from '@src/store';
import { sdk } from '@src/xhr/graphql-request';
import { useHotel } from '@src/xhr/query';
import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export const useAuthorizeApaleo = () => {
  const history = useHistory();
  const { setApaleoState, apaleoState } = useStore(
    useCallback(
      ({ setApaleoState, apaleoState }) => ({ setApaleoState, apaleoState }),
      []
    )
  );
  const { mutate: mutateHotel } = useHotel();

  const authorizeApaleo = useCallback(async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!state || !apaleoState || state !== apaleoState) {
      return;
    }

    if (code) {
      setApaleoState(undefined);
      history.push('/manage/marketplace/apaleo');

      try {
        await sdk.authorizeApaleo({ code });
        await mutateHotel();
        history.push('/manage/marketplace/apaleo', { configure: true });
        // eslint-disable-next-line no-empty
      } catch {
        toast.warn('Unable to connect');
      }
    }
  }, [history, mutateHotel, apaleoState, setApaleoState]);

  useEffect(() => {
    if (window.location.pathname === '/manage/marketplace/apaleo') {
      authorizeApaleo();
    }
  }, [authorizeApaleo]);
};
