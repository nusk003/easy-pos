import { getNights } from '@hm/booking';
import { BookingStatus, MessageAuthor, Order } from '@hm/sdk';
import { Link, Text } from '@src/components/atoms';
import { OrdersModal } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { format } from '@src/util/format';
import {
  useBookings,
  useGuest,
  useHotel,
  useOrders,
  useThreads,
} from '@src/xhr/query';
import dayjs from 'dayjs';
import parseHTML from 'html-react-parser';
import MarkdownIt from 'markdown-it';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const SWrapper = styled.div<{ visible: boolean }>`
  height: calc(100vh - 93px);
  width: 320px;
  position: absolute;
  right: ${(props) => (props.visible ? '0' : '-640px')};
  transition: right 0.3s;
  overflow-y: auto;
  box-sizing: border-box;
  border-left: 0.5px solid #e8eaef;

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

  ${theme.mediaQueries.laptop} {
    position: relative;
    width: calc(100% + 16px);
    display: ${(props) => (props.visible ? 'block' : 'none')};
    border-left: none;
  }

  ${theme.mediaQueries.tablet} {
    height: calc(100vh - 76.5px);
  }
`;

const SContentWrapper = styled.div`
  padding-left: 16px;
`;

const SHeading = styled.div`
  display: grid;
  align-content: center;
  padding: 0 16px;
  height: 50px;
  border-bottom: 0.5px solid #e8eaef;
`;

const SSectionHeading = styled.div`
  display: grid;
  align-content: center;
  grid-auto-flow: column;
  justify-content: space-between;
  margin-top: ${(props) => props.theme.space.giant}px;
  margin-bottom: ${(props) => props.theme.space.medium}px;
  padding-bottom: ${(props) => props.theme.space.small}px;
  border-bottom: 1px solid ${theme.colors.lightGray};
  margin-left: -16px;
  padding-left: 16px;
`;

const SSectionTileHeadingText = styled(Text.Interactive)`
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  color: ${(props) => props.theme.colors.blue};
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.space.tiny}px;
  margin-top: ${(props) => props.theme.space.small}px;
`;

const SClose = styled(Text.Body)`
  cursor: pointer;
  user-select: none;
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  width: max-content;
`;

const SSectionTile = styled.div`
  cursor: pointer;
  padding-right: 16px;
`;

const SMessageText = styled(Text.Body)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
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

const DISPLAY_LIMIT = 2;

interface Props {
  guestId?: string;
  visible: boolean;
  threadId: string;
  onClose: () => void;
}

export const MessagesGuestDetails: React.FC<Props> = ({
  guestId,
  visible,
  onClose,
  threadId,
}) => {
  const history = useHistory();

  const { data: hotel } = useHotel(false);
  const { data: guest } = useGuest(guestId);
  const { data: allBookings } = useBookings({ guestId });
  const { data: allOrders } = useOrders({ guestId });
  const { data: allThreads } = useThreads({ guestId });

  const [state, setState] = useState<{
    isOrdersModalVisible: boolean;
    order: Order | undefined;
  }>({ isOrdersModalVisible: false, order: undefined });

  const [orders, setOrders] = useState(
    allOrders?.slice(0, DISPLAY_LIMIT) || []
  );
  const [bookings, setBookings] = useState(
    allBookings?.slice(0, DISPLAY_LIMIT) || []
  );
  const [threads, setThreads] = useState(
    allThreads
      ?.filter((thread) => thread.id !== threadId)
      ?.slice(0, DISPLAY_LIMIT) || []
  );

  useEffect(() => {
    setOrders(allOrders?.slice(0, DISPLAY_LIMIT) || []);
    setThreads(
      allThreads
        ?.filter((thread) => thread.id !== threadId)
        ?.slice(0, DISPLAY_LIMIT) || []
    );
    setBookings(allBookings?.slice(0, DISPLAY_LIMIT) || []);

    return () => {
      setBookings([]);
      setOrders([]);
      setThreads([]);
    };
  }, [allBookings, allOrders, allThreads, threadId]);

  const toggleOrdersModal = (order?: Order) => {
    setState((s) => {
      if (order) {
        s.order = order;
      }

      return { ...s, isOrdersModalVisible: !s.isOrdersModalVisible };
    });
  };

  if (!guest || !hotel) {
    return <SWrapper visible={false} />;
  }

  return (
    <>
      <SWrapper visible={visible}>
        <SHeading>
          <SClose onClick={onClose}>{'✕'}</SClose>
        </SHeading>

        <SContentWrapper>
          <Text.Descriptor fontWeight="semibold" mt="medium">
            Email address
          </Text.Descriptor>
          <Text.Body mt="tiny">{guest.email}</Text.Body>

          {guest.mobile && guest.mobileCountryCode ? (
            <>
              <Text.Descriptor fontWeight="semibold" mt="medium">
                Mobile
              </Text.Descriptor>
              <Text.Body mt="tiny">{format.mobile(guest)}</Text.Body>
            </>
          ) : null}

          <SSectionHeading>
            <Text.Descriptor fontWeight="semibold">
              Past Bookings
            </Text.Descriptor>
            {guest.bookings && guest.bookings.length > 2 ? (
              <Link
                onClick={() =>
                  setBookings(
                    bookings.length <= 2
                      ? guest.bookings || []
                      : guest.bookings?.slice(0, 2) || []
                  )
                }
                disableOnClick={false}
              >
                {bookings.length <= 2 ? 'See all' : 'Hide'}
              </Link>
            ) : null}
          </SSectionHeading>
          {bookings.length ? (
            bookings.map((booking) => (
              <SSectionTile
                key={booking.id}
                onClick={() =>
                  history.push(`/bookings/${booking.id}`, { booking })
                }
              >
                <SSectionTileHeadingText>
                  {dayjs(booking.checkInDate).format('DD/MM/YY')} -{' '}
                  {dayjs(booking.checkOutDate).format('DD/MM/YY')}
                  <Text.Descriptor fontWeight="medium">
                    {getNights(booking)} night
                    {getNights(booking) > 1 ? 's' : ''}
                  </Text.Descriptor>
                </SSectionTileHeadingText>
                <SMessageText>
                  {booking.status === BookingStatus.Canceled
                    ? 'Canceled'
                    : booking.status === BookingStatus.CheckedIn
                    ? 'Checked-in'
                    : booking.status === BookingStatus.Created
                    ? 'Created'
                    : booking.status === BookingStatus.Reviewed
                    ? 'Reviewed successfully'
                    : booking.status === BookingStatus.Submitted
                    ? 'Ready to review'
                    : undefined}
                </SMessageText>
              </SSectionTile>
            ))
          ) : (
            <Text.Descriptor>
              {guest.firstName} has not made booking yet
            </Text.Descriptor>
          )}

          <SSectionHeading>
            <Text.Descriptor fontWeight="semibold">
              Past conversations
            </Text.Descriptor>
            {guest.threads && guest.threads.length > 2 ? (
              <Link
                onClick={() =>
                  setThreads(
                    threads.length <= 2
                      ? guest.threads || []
                      : guest.threads?.slice(0, 2) || []
                  )
                }
                disableOnClick={false}
              >
                {threads.length <= 2 ? 'See all' : 'Hide'}
              </Link>
            ) : null}
          </SSectionHeading>
          {threads.length ? (
            threads.map((thread) => (
              <SSectionTile
                key={thread.id}
                onClick={() =>
                  history.push(`/messages/${thread.id}`, { thread })
                }
              >
                <SSectionTileHeadingText>
                  {thread.lastMessage?.author === MessageAuthor.Guest
                    ? guest.firstName
                    : hotel.name}
                  <Text.Descriptor fontWeight="medium">
                    {dayjs(thread.lastMessage?.dateCreated).format('D MMM')}
                  </Text.Descriptor>
                </SSectionTileHeadingText>
                <SMessageText>
                  {parseMessage(thread.lastMessage?.text)}
                </SMessageText>
              </SSectionTile>
            ))
          ) : (
            <Text.Descriptor>
              {guest.firstName} has no previous conversations
            </Text.Descriptor>
          )}

          <SSectionHeading>
            <Text.Descriptor fontWeight="semibold">Past orders</Text.Descriptor>
            {orders && orders.length > 2 ? (
              <Link
                onClick={() =>
                  setOrders(
                    orders.length <= 2 ? orders || [] : orders.slice(0, 2) || []
                  )
                }
                disableOnClick={false}
              >
                {orders.length <= 2 ? 'See all' : 'Hide'}
              </Link>
            ) : null}
          </SSectionHeading>
          {orders.length ? (
            orders.map((order) => (
              <SSectionTile
                key={order.id}
                onClick={() => toggleOrdersModal(order)}
              >
                <SSectionTileHeadingText>
                  {order?.space?.name}
                  <Text.Descriptor fontWeight="medium">
                    {dayjs(order.dateCreated).format('D MMM')}
                  </Text.Descriptor>
                </SSectionTileHeadingText>
                <Text.Body>
                  {order.items?.length} items (
                  {format.currency(order.totalPrice)})
                </Text.Body>
              </SSectionTile>
            ))
          ) : (
            <Text.Descriptor>
              {guest.firstName} has not made an order yet
            </Text.Descriptor>
          )}
        </SContentWrapper>
      </SWrapper>

      <OrdersModal
        visible={state.isOrdersModalVisible}
        onClose={toggleOrdersModal}
        order={state.order}
      />
    </>
  );
};
