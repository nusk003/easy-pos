import { cache } from 'swr';
import { useStore, purge } from '@src/store';
import { sdk } from '@src/xhr/graphql-request';

export const logout = async () => {
  const { loggedIn, setLoggedIn, WS } = useStore.getState();

  if (loggedIn) {
    await sdk.userLogout();
  }

  purge();

  cache.keys().forEach((key) => {
    cache.delete(key);
  });

  WS?.close();

  setLoggedIn(false);

  window.parent.postMessage('logout', '*');
};
