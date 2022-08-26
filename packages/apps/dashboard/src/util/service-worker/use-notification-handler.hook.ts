import { messageNotification } from '@src/assets/sounds/message-notification.sound';
import { orderNotification } from '@src/assets/sounds/order-notification.sound';
import { sdk } from '@src/xhr/graphql-request';
import { useUser } from '@src/xhr/query';
import { useCallback, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export const useNotificationHandler = (): null => {
  const history = useHistory();
  const location = useLocation();

  const { data: user } = useUser(false);

  const deviceId = localStorage.getItem('deviceId');

  const pushSubscription = user?.pushSubscriptions?.find(
    (p) => p.id === deviceId
  );

  const handleNotification = useCallback(
    async (event: MessageEvent) => {
      const notification = event.data;

      if (notification.status === 'received') {
        if (notification.action === 'new-order') {
          if (pushSubscription?.sound) {
            orderNotification.play();
          }
        } else if (notification.action === 'new-booking') {
          if (pushSubscription?.sound) {
            orderNotification.play();
          }
        } else if (notification.action === 'new-message') {
          const threadId = location.pathname.split('/messages/')[1];

          if (
            notification.focused &&
            threadId === notification.data.thread.id
          ) {
            return;
          }

          const pushNotification = new Notification(
            `${notification.data.thread.guest.firstName} ${notification.data.thread.guest.lastName}`,
            {
              body: notification.data.message.text,
              icon: 'logo-icon.png',
              data: notification,
            }
          );

          pushNotification.onclick = () => {
            pushNotification.close();
            window.focus();
            history.push(`/messages/${notification.data.thread.id}`);
          };

          if (pushSubscription?.sound) {
            messageNotification.play();
          }
          return;
        }

        return;
      } else {
        if (notification.action === 'new-order') {
          const { order } = await sdk.order({
            where: { id: notification.data.id },
          });

          history.push('/orders', { order });
        }
        if (
          notification.action === 'new-booking' ||
          notification.action === 'submit-booking'
        ) {
          const { booking } = await sdk.booking({
            where: { id: notification.data.id },
          });

          history.push('/bookings', { booking });
        } else if (notification.action === 'new-message') {
          history.push(`/messages/${notification.data.thread.id}`);
        }
      }
    },
    [history, location.pathname, pushSubscription]
  );

  useEffect(() => {
    navigator.serviceWorker.addEventListener('message', handleNotification);

    return () => {
      navigator.serviceWorker.removeEventListener(
        'message',
        handleNotification
      );
    };
  }, [handleNotification]);

  return null;
};
