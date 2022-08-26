self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  const notification = event.data.json().data;
  let focused = false;
  let background = false;

  event.waitUntil(
    self.clients
      .matchAll({
        type: 'window',
      })
      .then((clientList) => {
        focused = clientList.some((client) => {
          return client.visibilityState !== 'prerender';
        });

        background = clientList.length > 0;

        if (focused || background) {
          const client = clientList[clientList.length - 1];
          client.postMessage({
            ...notification,
            status: 'received',
            focused,
            background,
          });
        }

        if (notification.action === 'new-message') {
          if (focused) {
            return;
          }

          self.registration.showNotification(
            `${notification.data.thread.guest.firstName} ${notification.data.thread.guest.lastName}`,
            {
              body: notification.data.message.text,
              icon: 'logo-icon.png',
              data: notification,
            }
          );
        } else if (notification.action === 'new-order') {
          self.registration.showNotification(
            `Order #${notification.data.orderReference.toUpperCase()} Created`,
            {
              body: 'Click here to view the order details',
              icon: 'logo-icon.png',
              data: notification,
            }
          );
        } else if (notification.action === 'new-booking') {
          self.registration.showNotification(
            `Booking #${notification.data.bookingReference.toUpperCase()} Created`,
            {
              body: 'Click here to view the booking details',
              icon: 'logo-icon.png',
              data: notification,
            }
          );
        } else if (notification.action === 'submit-booking') {
          self.registration.showNotification(
            `Booking #${notification.data.bookingReference.toUpperCase()} Submitted`,
            {
              body: 'Click here to view the booking details',
              icon: 'logo-icon.png',
              data: notification,
            }
          );
        }
      })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const notification = event.notification.data;

  event.waitUntil(
    self.clients
      .matchAll({
        type: 'window',
      })
      .then((clientList) => {
        if (clientList.length > 0) {
          const client = clientList[clientList.length - 1];

          if (!client.focused) {
            client.focus();
          }

          client.postMessage({ ...notification });
        } else if (self.clients.openWindow) {
          if (notification.action === 'new-message') {
            self.clients.openWindow(`/messages/${notification.data.thread.id}`);
          } else if (notification.action === 'new-order') {
            self.clients.openWindow(`/orders?id=${notification.data.id}`);
          } else if (
            notification.action === 'new-booking' ||
            notification.action === 'submit-booking'
          ) {
            self.clients.openWindow(`/bookings?id=${notification.data.id}`);
          }
        }
      })
  );
});
