import { sdk } from '@src/xhr/graphql-request';
import { useEffect } from 'react';

export const useReauthenticate = () => {
  useEffect(() => {
    const interval = setInterval(async () => {
      await sdk.user();
    }, 24 * 60 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
};
