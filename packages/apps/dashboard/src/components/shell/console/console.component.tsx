import { Title } from '@src/components/atoms';
import { Routes, Sidebar, Support } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { __electron__ } from '@src/constants';
import { useStore } from '@src/store';
import { useReauthenticate } from '@src/util/auth';
import { usePrintQueue } from '@src/util/printer';
import { useWebsockets } from '@src/xhr';
import { gqlClient, Listener } from '@src/xhr/graphql-request';
import { persistSWR, persistSWRReload } from '@src/xhr/query';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { NotificationPermission } from './notification-permisson.component';

const loginAnimation = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1
  }
`;

const SWrapper = styled.div<{ hideSidebar?: boolean }>`
  height: 100vh;
  display: grid;
  grid-template-columns: ${(props) =>
    !props.hideSidebar ? 'max-content auto' : undefined};

  animation: ${loginAnimation} 0.3s;

  ${theme.mediaQueries.tablet} {
    grid-template-columns: auto;
  }
`;

const SPagesWrapper = styled.div`
  padding-right: 16px;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: #bbb #fff;

  &::-webkit-scrollbar {
    width: 11px;
  }

  &::-webkit-scrollbar-track {
    background: #fff;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #bbb;
    border-radius: 6px;
    border: 3px solid #fff;
  }
`;

export const Console: React.FC = () => {
  const { hotelId } = useStore(
    useCallback(
      (state) => ({
        hotelId: state.hotelId,
      }),
      []
    )
  );

  const { pathname, search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const pagesRef = useRef<HTMLDivElement>(null);

  const [isSupportVisible, setIsSupportVisible] = useState(false);

  useWebsockets();

  const isNotficationSupported =
    !__electron__ &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window;

  const [key, setKey] = useState(String(Math.random()));

  const sdkListener: Listener = useCallback((query) => {
    if (typeof query === 'string' && query.includes('query hotel')) {
      const updateKeyEvent = sessionStorage.getItem('update-key');

      if (!updateKeyEvent) {
        return;
      }

      setImmediate(() => {
        setKey(String(Math.random()));
      });
      sessionStorage.removeItem('update-key');
    }
  }, []);

  useEffect(() => {
    gqlClient.addEventListener(sdkListener);

    return () => {
      gqlClient.removeEventListener(sdkListener);
    };
  }, [sdkListener]);

  const unsubscribeSWR = useRef<() => void>();
  useEffect(() => {
    if (!unsubscribeSWR.current) {
      unsubscribeSWR.current = persistSWR(hotelId);
    } else {
      unsubscribeSWR.current = persistSWRReload(hotelId);
    }

    return () => {
      if (unsubscribeSWR.current) {
        unsubscribeSWR.current();
      }
    };
  }, [hotelId]);

  useEffect(() => {
    pagesRef.current?.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (searchParams.get('hide_sidebar')?.toLowerCase() === 'true') {
      window.sessionStorage.setItem('hideSidebar', 'true');
    }
  }, [searchParams]);

  useReauthenticate();

  usePrintQueue();

  return (
    <>
      <Title key={hotelId} />

      {isNotficationSupported ? <NotificationPermission /> : null}

      <Support
        visible={isSupportVisible}
        onSupportClose={() => setIsSupportVisible((s) => !s)}
      />

      <SWrapper
        hideSidebar={
          searchParams.get('hide_sidebar')?.toLowerCase() === 'true' ||
          window.sessionStorage.getItem('hideSidebar') === 'true'
        }
      >
        <Sidebar
          hotelIdKey={hotelId}
          onSupportClick={() => setIsSupportVisible((s) => !s)}
          isSupportVisible={isSupportVisible}
        />
        <SPagesWrapper ref={pagesRef}>
          <Routes key={key} />
        </SPagesWrapper>
      </SWrapper>
    </>
  );
};
