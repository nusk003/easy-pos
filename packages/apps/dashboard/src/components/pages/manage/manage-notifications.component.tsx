import { UserPushSubscription, WebPushSubscription } from '@hm/sdk';
import { orderNotification } from '@src/assets/sounds/order-notification.sound';
import { Button, Text, toast } from '@src/components/atoms';
import {
  ManageNotificationsPushSubscriptionTile,
  ManageNotificationsToggleNotificationTile,
} from '@src/components/organisms';
import { Form, Header } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { useStore } from '@src/store';
import { sdk } from '@src/xhr/graphql-request';
import { useUser } from '@src/xhr/query';
import React, { useCallback, useMemo, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import styled from 'styled-components';
import UAParser from 'ua-parser-js';

const SWrapper = styled.div`
  min-height: calc(100vh - 141px);
  margin-right: -16px;

  background: #fafafa;
  padding: 32px;

  display: grid;
  align-content: start;

  ${theme.mediaQueries.tablet} {
    padding: 16px;
    min-height: calc(100vh - 101px);
  }
`;

const ManageNotificationsToggleNotificationTilesWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  padding-bottom: 48px;
  gap: 24px;
  max-width: ${theme.mediaQueries.size.tablet}px;

  ${theme.mediaQueries.tablet} {
    max-width: 100%;
    grid-template-columns: auto;
  }
`;

const SDevicesGrid = styled.div`
  display: grid;
  grid-template-columns: max-content max-content;
  gap: 8px 32px;

  ${theme.mediaQueries.tablet} {
    grid-template-columns: auto;
    gap: 4px;
  }
`;

const SDevicesHeadingText = styled(Text.Primary)`
  ${theme.mediaQueries.tablet} {
    display: none;
  }
`;

interface NotificationToggleFormValues {
  orders?: boolean;
  threads?: boolean;
  bookings?: boolean;
}

export const ManageNotifications = () => {
  const { data: user, mutate: mutateUser } = useUser();

  const [loading, setLoading] = useState(false);

  const formMethods = useForm<NotificationToggleFormValues>({
    defaultValues: (user?.notifications || {}) as NotificationToggleFormValues,
  });

  const { setUserSettings } = useStore(
    useCallback(
      (state) => ({
        userSettings: state.userSettings,
        setUserSettings: state.setUserSettings,
      }),
      []
    )
  );

  const deviceId = localStorage.getItem('deviceId');

  const handleToggleNotification = async (
    formValues: NotificationToggleFormValues
  ) => {
    if (!user) {
      return;
    }

    setLoading(true);
    const toastId = toast.loader('Updating notification settings');

    try {
      await sdk.updateUser({
        data: { notifications: formValues },
      });

      mutateUser((user) => {
        if (!user) {
          return user;
        }

        user.notifications = formValues;
        return user;
      }, false);

      toast.update(toastId, 'Successfully updated notification settings');
    } catch {
      const updatedUser = await mutateUser();

      formMethods.setValue('bookings', updatedUser?.notifications?.bookings);
      formMethods.setValue('orders', updatedUser?.notifications?.orders);
      formMethods.setValue('messages', updatedUser?.notifications?.messages);

      toast.update(toastId, 'Unable to update notification settings');
    }

    setLoading(false);
  };

  const unsubscribeNotification = async (id: string) => {
    setLoading(true);
    const toastId = toast.loader('Updating notification settings');

    try {
      await sdk.unsubscribeUserPushNotifications({ deviceId: id });
      await mutateUser();

      if (id === deviceId) {
        setUserSettings({ notificationsAllowed: false });
      }

      toast.update(toastId, 'Successfully updated notification settings');
    } catch {
      toast.update(toastId, 'Unable to update notification settings');
    }

    setLoading(false);
  };

  const subscribeNotification = async (id: string, sound: boolean) => {
    setLoading(true);
    const toastId = toast.loader('Updating notification settings');

    try {
      await mutateUser((user) => {
        if (!user || !user.pushSubscriptions) {
          return user;
        }

        const subscriptions = [...user.pushSubscriptions];
        const idx = subscriptions.findIndex((p) => p.id === id);

        if (idx !== undefined && idx > -1) {
          subscriptions[idx].sound = sound;
          user.pushSubscriptions = subscriptions;
        }

        return user;
      }, false);

      const sw = await navigator.serviceWorker.ready;

      const pushSubscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey:
          'BINZuJSqzrjnKq-CR4f1XG0zKp4Nxi-vYLrdqx7Xf5HJN9sEcJlAH-NlFDB4F8DaIAVV7Ppzp1znm3yNjiwDco8',
      });

      const serializedPushSubscription = JSON.parse(
        JSON.stringify(pushSubscription)
      ) as WebPushSubscription;

      await sdk.subscribeUserPushNotifications({
        deviceId: id,
        sound,
        pushSubscription: serializedPushSubscription,
      });

      await mutateUser();

      if (id === deviceId) {
        setUserSettings({ notificationsAllowed: true });
      }

      toast.update(toastId, 'Successfully updated notification settings');
    } catch {
      await mutateUser();
      toast.update(toastId, 'Unable to update notification settings');
    }

    setLoading(false);
  };

  const pushSubscription = useMemo(
    () => user?.pushSubscriptions?.find((p) => p.id === deviceId),
    [deviceId, user?.pushSubscriptions]
  );

  const agent = useMemo(() => new UAParser(), []);

  const devicePushSubscription: Omit<UserPushSubscription, 'pushSubscription'> =
    useMemo(
      () =>
        pushSubscription || {
          id: deviceId!,
          sound: false,
          dateUpdated: new Date(),
          device: {
            vendor: agent.getDevice().vendor,
            model: agent.getDevice().model,
            type: agent.getDevice().type,
            browser: agent.getBrowser().name,
            os: agent.getOS().name === 'Mac OS' ? 'macOS' : agent.getOS().name,
          },
          enabled: false,
        },
      [agent, deviceId, pushSubscription]
    );

  return (
    <>
      <Header title="Notifications" backgroundColor="#fafafa" />
      <SWrapper>
        <FormContext {...formMethods}>
          <Form.Provider
            onChange={formMethods.handleSubmit(handleToggleNotification)}
          >
            <ManageNotificationsToggleNotificationTilesWrapper>
              <ManageNotificationsToggleNotificationTile
                description={
                  'You will recieve email and push notifications whenever an order is submitted by a guest.'
                }
                name="orders"
                loading={loading}
              />
              <ManageNotificationsToggleNotificationTile
                description={
                  'You will recieve email and push notifications whenever a message is sent by a guest.'
                }
                name="messages"
                loading={loading}
              />
              <ManageNotificationsToggleNotificationTile
                description={
                  'You will recieve email and push notifications whenever a guest adds information to their booking.'
                }
                name="bookings"
                loading={loading}
              />
            </ManageNotificationsToggleNotificationTilesWrapper>
          </Form.Provider>
        </FormContext>

        <Text.Heading mb="8px">Devices</Text.Heading>
        <Text.Primary color={theme.textColors.lightGray} mb="16px">
          Toggle which devices to display push notifications
        </Text.Primary>
        <SDevicesGrid>
          <SDevicesHeadingText fontWeight="medium" mb="4px">
            Device
          </SDevicesHeadingText>
          <SDevicesHeadingText fontWeight="medium" mb="4px">
            Sound
          </SDevicesHeadingText>

          <ManageNotificationsPushSubscriptionTile
            key={devicePushSubscription.id}
            onSubscribeNotification={subscribeNotification}
            onUnsubscribeNotification={unsubscribeNotification}
            pushSubscription={devicePushSubscription as UserPushSubscription}
            loading={loading}
          />

          {user?.pushSubscriptions
            ?.filter(
              (pushSubscription) =>
                pushSubscription.enabled &&
                pushSubscription.id !== devicePushSubscription.id
            )
            ?.sort((pushSubscription) =>
              deviceId === pushSubscription.id ? -1 : 1
            )
            .map((pushSubscription) => (
              <ManageNotificationsPushSubscriptionTile
                key={pushSubscription.id}
                onSubscribeNotification={subscribeNotification}
                onUnsubscribeNotification={unsubscribeNotification}
                pushSubscription={pushSubscription}
                loading={loading}
              />
            ))}
        </SDevicesGrid>
        <Button
          buttonStyle="secondary"
          mt="medium"
          onClick={() => orderNotification.play()}
        >
          Test sound
        </Button>
      </SWrapper>
    </>
  );
};
