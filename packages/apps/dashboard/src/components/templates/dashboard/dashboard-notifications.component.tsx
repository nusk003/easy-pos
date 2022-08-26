import {
  Booking,
  BookingStatus,
  MessageAuthor,
  Order,
  OrderStatus,
  PricelistDeliveryType,
  Thread,
} from '@hm/sdk';
import { Text } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import {
  DashboardNotificationTile,
  DashboardNotificationTileProps,
} from '@src/components/organisms';
import { Form } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { format } from '@src/util/format';
import { useOrders, useThreads } from '@src/xhr/query';
import { useSearchBookings } from '@src/xhr/query/search-bookings.query';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import parseHTML from 'html-react-parser';
import MarkdownIt from 'markdown-it';
import React, { useMemo, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import styled from 'styled-components';

dayjs.extend(advancedFormat);

const SWrapper = styled.div`
  display: grid;
`;

const SActionWrapper = styled.div`
  margin-top: 16px;
`;

const SNotificationTilesWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 24px;
  justify-content: start;
  overflow: auto;

  margin-top: 0;
  padding-top: 16px;

  margin-bottom: -16px;
  padding-bottom: 16px;

  padding-left: 32px;
  margin-left: -32px;

  margin-right: -32px;
  padding-right: 32px;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const SEmptyWrapper = styled.div`
  background: ${theme.colors.offWhite};
  padding: 16px 32px;
  border-radius: 8px;
`;

const parseMessage = (text: string | undefined) => {
  if (!text) {
    return '';
  }

  const md = new MarkdownIt({ html: true });

  const markdownText = md.renderInline(text);
  const jsx = parseHTML(markdownText);

  return jsx;
};

export enum NotificationType {
  All = 'All',
  Orders = 'Orders',
  Threads = 'Messages',
  Bookings = 'Bookings',
}

enum NotificationSort {
  OldestFirst = 'Oldest First',
  NewestFirst = 'Newest First',
}

interface FormValues {
  type: NotificationType;
  sort: NotificationSort;
}

export type NotificationData = Booking | Order | Thread;

interface Props {
  onNotificationView: (data: NotificationData, type: NotificationType) => void;
}

export const DashboardNotifications: React.FC<Props> = ({
  onNotificationView,
}) => {
  const { data: orders, isValidating: isOrdersValidating } = useOrders();

  const { data: threads, isValidating: isThreadsValidating } = useThreads({
    resolved: false,
  });

  const { data: bookings, isValidating: isBookingsValidating } =
    useSearchBookings({
      status: BookingStatus.Submitted,
    });

  const [formValues, setFormValues] = useState<FormValues>({
    type: NotificationType.All,
    sort: NotificationSort.NewestFirst,
  });

  const notificationData: DashboardNotificationTileProps[] | undefined =
    useMemo(() => {
      const notifications: DashboardNotificationTileProps[] = [];

      if (orders) {
        if (
          formValues.type === NotificationType.All ||
          formValues.type === NotificationType.Orders
        ) {
          orders
            .filter(({ status }) => status === OrderStatus.Waiting)
            .forEach((order) => {
              notifications.push({
                id: order.id,
                onClick: () =>
                  onNotificationView(order, NotificationType.Orders),
                title: 'NEW ORDER',
                subtitle: `For ${order.guest.firstName} ${
                  order.guest.lastName
                }\n(${
                  order.delivery === PricelistDeliveryType.Room
                    ? 'Room '
                    : order.delivery === PricelistDeliveryType.Table
                    ? 'Table '
                    : ''
                }${order.roomNumber})`,
                description: `${order.items.length} item${
                  order.items.length > 1 ? 's' : ''
                } • ${format.currency(order.totalPrice)}`,
                guest: order.guest,
                dateUpdated: order.dateUpdated,
              });
            });
        }
      }

      if (threads) {
        if (
          formValues.type === NotificationType.All ||
          formValues.type === NotificationType.Threads
        ) {
          threads.forEach((thread) => {
            if (thread.lastMessage?.author === MessageAuthor.Guest) {
              notifications.push({
                id: thread.id,
                onClick: () =>
                  onNotificationView(thread, NotificationType.Threads),
                title: 'NEW MESSAGE',
                subtitle: `From ${thread.guest.firstName} ${thread.guest.lastName}`,
                description: parseMessage(thread.lastMessage.text.trim()),
                guest: thread.guest,
                dateUpdated: thread.dateUpdated,
              });
            }
          });
        }
      }

      if (bookings) {
        if (
          formValues.type === NotificationType.All ||
          formValues.type === NotificationType.Bookings
        ) {
          bookings.flat().forEach((booking) => {
            notifications.push({
              id: booking.id,
              onClick: () =>
                onNotificationView(booking, NotificationType.Bookings),
              title: 'REVIEW BOOKING',
              subtitle: `From ${booking.guest?.firstName} ${booking.guest?.lastName}`,
              description: `${dayjs(booking.checkInDate).format(
                'ddd Do MMM'
              )} - ${dayjs(booking.checkOutDate).format('ddd Do MMM')}`,
              guest: booking.guest!,
              dateUpdated: booking.dateUpdated,
            });
          });
        }
      }

      if (
        !notifications.length ||
        (isOrdersValidating && !orders?.length) ||
        (isThreadsValidating && !threads?.length) ||
        (isBookingsValidating && !bookings?.length)
      ) {
        if (isOrdersValidating || isThreadsValidating || isBookingsValidating) {
          return Array.from<string, DashboardNotificationTileProps>(
            { length: 20 },
            (_, idx) => ({
              id: String(idx),
            })
          );
        }

        return undefined;
      }

      return notifications.sort((a, b) => {
        const notificationSort =
          formValues.sort === NotificationSort.NewestFirst ? 1 : -1;

        if (a.dateUpdated! > b.dateUpdated!) {
          return notificationSort * -1;
        }

        return notificationSort;
      });
    }, [
      bookings,
      formValues,
      isBookingsValidating,
      isOrdersValidating,
      isThreadsValidating,
      orders,
      threads,
      onNotificationView,
    ]);

  const formMethods = useForm<FormValues>({
    defaultValues: formValues,
  });

  return (
    <SWrapper>
      <Text.Body fontWeight="semibold">Notification Center</Text.Body>
      <SActionWrapper>
        <FormContext {...formMethods}>
          <Form.Provider
            gridAutoFlow="column"
            justifyContent="start"
            gridGap="8px"
            onChange={formMethods.handleSubmit(setFormValues)}
          >
            <Inputs.Select
              name="type"
              items={[
                NotificationType.All,
                NotificationType.Orders,
                NotificationType.Threads,
                NotificationType.Bookings,
              ]}
            />
            <Inputs.Select
              name="sort"
              items={[
                NotificationSort.NewestFirst,
                NotificationSort.OldestFirst,
              ]}
            />
          </Form.Provider>
        </FormContext>
      </SActionWrapper>
      <SNotificationTilesWrapper>
        {notificationData?.map((notification) => (
          <DashboardNotificationTile key={notification.id} {...notification} />
        )) || (
          <SEmptyWrapper>
            <Text.Body fontWeight="semibold" color={theme.textColors.lightGray}>
              No notifications to review
            </Text.Body>
          </SEmptyWrapper>
        )}
      </SNotificationTilesWrapper>
    </SWrapper>
  );
};
