import { User } from '@hm/sdk';
import * as Sentry from '@sentry/react';
import { Console, Login } from '@src/components/shell';
import { __root_address__ } from '@src/constants';
import { useStore } from '@src/store';
import { login, logout } from '@src/util/auth';
import { useOnlineStatus } from '@src/util/websockets';
import { sdk } from '@src/xhr/graphql-request';
import { queryMap } from '@src/xhr/query';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { cache, SWRConfig } from 'swr';

const CreateAccount = React.lazy(() =>
  import('@src/components/pages/create-account').then((module) => ({
    default: module.CreateAccount,
  }))
);

const ManageMarketplace = React.lazy(() =>
  import('@src/components/pages/manage/manage-marketplace.component').then(
    (module) => ({
      default: module.ManageMarketplace,
    })
  )
);

const MarketplaceConnect = React.lazy(() =>
  import(
    '@src/components/pages/marketplace-connect/marketplace-connect.component'
  ).then((module) => ({
    default: module.MarketplaceConnect,
  }))
);

export const AppContent: React.FC = () => {
  const history = useHistory();

  const { loggedIn, setLoggedIn } = useStore(
    useCallback(
      (state) => ({
        loggedIn: state.loggedIn,
        setLoggedIn: state.setLoggedIn,
      }),
      []
    )
  );

  const onlineStatus = useOnlineStatus();

  const [hasCheckedLoggedIn, setHasCheckedLoggedIn] = useState(false);

  const checkLoggedIn = useCallback(async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    const redirectURL = searchParams.get('redirect_url');
    const hotelId = searchParams.get('hotel_id');

    let user: User | undefined;

    if (hotelId) {
      const { setHotelId } = useStore.getState();
      setHotelId(hotelId);
    }

    if (token) {
      history.push('/');

      user = (await login({ token })) as User;

      if (user) {
        if (redirectURL) {
          if (redirectURL.includes(__root_address__)) {
            history.push(redirectURL.replace(__root_address__, ''));
          } else {
            window.location.href = redirectURL;
            return;
          }
        }

        if (!hotelId) {
          const { setHotelId } = useStore.getState();
          setHotelId(user.hotels?.[0].id);
        }

        setLoggedIn(true);
      }

      setHasCheckedLoggedIn(true);
    }

    try {
      if (!user) {
        const response = await sdk.user();
        user = response.user as User;
      }

      cache.set(queryMap.user.key, user);

      Sentry.configureScope((scope) => {
        if (process.env.REACT_APP_STAGE !== 'development') {
          scope.setUser({ email: user!.email });
        }
      });

      const { hotelId, setHotelId } = useStore.getState();

      const hotel = user.hotels?.find((h) => h.id === hotelId);

      if (!hotel || !hotelId) {
        const newHotelId = user.hotels?.[0].id;
        if (newHotelId) {
          setHotelId(newHotelId);
        }
      } else {
        setHotelId(hotelId);
      }

      localStorage.setItem('loggedIn', 'true');
      setLoggedIn(true);
    } catch (err) {
      localStorage.removeItem('loggedIn');
      await logout();
      setLoggedIn(false);
      setHasCheckedLoggedIn(true);
    }

    setHasCheckedLoggedIn(true);
  }, [history, setLoggedIn]);

  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  useEffect(() => {
    if (hasCheckedLoggedIn && onlineStatus) {
      checkLoggedIn();
    }
  }, [onlineStatus, checkLoggedIn, hasCheckedLoggedIn]);

  const clearSplash = useCallback(async () => {
    if (hasCheckedLoggedIn) {
      const splash = document.getElementById('splash');
      if (splash) {
        splash.style.opacity = '0';
        splash.style.zIndex = '-99';
      }
    }
  }, [hasCheckedLoggedIn]);

  useEffect(() => {
    clearSplash();
  }, [clearSplash]);

  return (
    <Suspense fallback={null}>
      {hasCheckedLoggedIn ? (
        <SWRConfig
          value={{
            refreshInterval: 0,
            revalidateOnFocus: false,
            dedupingInterval: 1000,
            errorRetryCount: 3,
            errorRetryInterval: 10000,
          }}
        >
          <Switch>
            <Route
              path={['/create-account', '/join/:userId']}
              component={CreateAccount}
            />
            {!loggedIn ? (
              <Route path="/manage/marketplace" component={ManageMarketplace} />
            ) : null}
            <Route
              path="/connect"
              component={loggedIn ? MarketplaceConnect : Login}
            />
            <Route path="/" component={loggedIn ? Console : Login} />
          </Switch>
        </SWRConfig>
      ) : null}
    </Suspense>
  );
};
