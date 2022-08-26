import { Booking, Order, Thread } from '@hm/sdk';
import { Feature } from '@src/components/atoms';
import {
  BookingsModal,
  DashboardNotifications,
  DashboardWhatsNew,
  Header,
  NotificationData,
  NotificationType,
  OrdersModal,
} from '@src/components/templates';
import { theme } from '@src/components/theme';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

const SWrapper = styled.div`
  display: grid;
  gap: 24px;
  padding: 32px;
  padding-right: 16px;

  ${theme.mediaQueries.tablet} {
    padding: 16px;
    padding-right: 0;
  }
`;

export const Dashboard: React.FC = () => {
  const history = useHistory();

  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [booking, setBooking] = useState<Booking | undefined>(undefined);

  useEffect(() => {
    if (history.location.pathname !== '/') {
      history.replace('/');
    }
  }, [history]);

  const onNotificationView = useCallback(
    (data: NotificationData, type: NotificationType) => {
      if (type === NotificationType.Orders) {
        setOrder(data as Order);
        setShowOrderModal(true);
      } else if (type === NotificationType.Bookings) {
        setBooking(data as Booking);
        setShowBookingModal(true);
      } else if (type === NotificationType.Threads) {
        history.push(`/messages/${(data as Thread).id}`);
      }
    },
    [setBooking, setOrder, setShowOrderModal, setShowBookingModal, history]
  );

  const closeNotificationModal = useCallback(() => {
    setShowOrderModal(false);
    setShowBookingModal(false);
    setTimeout(() => {
      setOrder(undefined);
      setBooking(undefined);
    }, 300);
  }, [setShowOrderModal, setShowBookingModal, setOrder, setBooking]);

  return (
    <>
      <Header title="Home" />
      <OrdersModal
        visible={showOrderModal}
        order={order}
        onClose={closeNotificationModal}
      />
      <BookingsModal
        visible={showBookingModal}
        booking={booking}
        onClose={closeNotificationModal}
      />
      <SWrapper>
        {/* <DashboardNotifications onNotificationView={onNotificationView} /> */}
        <Feature name="whatsNew">{/* <DashboardWhatsNew /> */}</Feature>
      </SWrapper>
    </>
  );
};
