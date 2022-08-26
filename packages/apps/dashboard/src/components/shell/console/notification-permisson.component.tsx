import { WebPushSubscriptionInput } from '@hm/sdk';
import { Button, Text } from '@src/components/atoms';
import { __root_address__ } from '@src/constants';
import { useStore } from '@src/store';
import { useNotificationHandler } from '@src/util/service-worker';
import { sdk } from '@src/xhr/graphql-request';
import { useUser } from '@src/xhr/query';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

const SWrapper = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  z-index: 100000;
  backdrop-filter: blur(20px);
  align-content: center;
  justify-content: center;
`;

const SContentWrapper = styled.div`
  display: grid;
  background: #fff;
  padding: 24px 80px;
  border: 1px solid #e8eaef;
  border-radius: 16px;
  min-width: 60vw;
  justify-content: center;
  justify-items: center;
  text-align: center;
`;

export const NotificationPermission = () => {
  useNotificationHandler();

  const { mutate: mutateUser } = useUser(false);

  const [state, setState] = useState<{
    permission: NotificationPermission;
    sw?: ServiceWorkerRegistration;
  }>({ permission: Notification.permission, sw: undefined });

  const registerServiceWorker = async () => {
    const sw = await navigator.serviceWorker.register(
      `${__root_address__}/sw.js`
    );
    setState((s) => ({ ...s, sw }));
  };

  useEffect(() => {
    registerServiceWorker();
  }, []);

  const subscribe = useCallback(async () => {
    let deviceId = localStorage.getItem('deviceId');
    const { notificationsAllowed } = useStore.getState().userSettings;

    if (notificationsAllowed === false) {
      return;
    }

    if (!deviceId) {
      deviceId = uuid();
      localStorage.setItem('deviceId', deviceId);
    }

    const sw = await navigator.serviceWorker.ready;

    const pushSubscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey:
        'BINZuJSqzrjnKq-CR4f1XG0zKp4Nxi-vYLrdqx7Xf5HJN9sEcJlAH-NlFDB4F8DaIAVV7Ppzp1znm3yNjiwDco8',
    });

    const serializedPushSubscription = JSON.parse(
      JSON.stringify(pushSubscription)
    ) as WebPushSubscriptionInput;

    await sdk.subscribeUserPushNotifications({
      deviceId,
      pushSubscription: serializedPushSubscription,
    });

    await mutateUser();
  }, [mutateUser]);

  useEffect(() => {
    if (state.sw && state.permission === 'granted') {
      subscribe();
    }
  }, [state.permission, state.sw, subscribe]);

  const handlePress = () => {
    Notification.requestPermission((status) => {
      setState({ permission: status });
      if (status === 'granted') {
        subscribe();
      }
    });
  };

  if (state.permission !== 'default') {
    return null;
  }

  return (
    <SWrapper>
      <SContentWrapper>
        <Text.Heading fontWeight="semibold">Welcome to your</Text.Heading>
        <Text.Heading mt="tiny" fontWeight="semibold">
          Dashboard
        </Text.Heading>

        <Text.Primary mt="large">
          From here you can build your app, engage with your guests and manage
          your digital content.
        </Text.Primary>

        <Text.Interactive mt="large">
          We recommend turning on notifications so you don&apos;t miss out on
          guest requests.
        </Text.Interactive>

        <Button onClick={handlePress} mt="large" buttonStyle="primary">
          Enable Notifications
        </Button>
      </SContentWrapper>
    </SWrapper>
  );
};
