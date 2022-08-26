import { getOrderTime } from '@hm/orders';
import { Order, OrderStatus } from '@hm/sdk';
import { Text } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import { format } from '@src/util/format';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';

const SWrapper = styled.div<{ status: OrderStatus }>`
  border: 2px solid transparent;
  padding: 16px 0;
  border-bottom: 1px solid ${theme.colors.gray};
  margin-bottom: 16px;
  height: 125px;
  user-select: none;
  cursor: pointer;

  ${(props) =>
    props.status === OrderStatus.Waiting
      ? css`
          box-shadow: 0px 4px 16px rgba(100, 100, 100, 0.16);
          border-radius: 12px;
          border-bottom: none;
          padding: 16px;
        `
      : undefined}
`;

const SOrderIdWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  font-size: 12px;
  color: ${theme.textColors.gray};
`;

const SOrderNameText = styled(Text.Primary)`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const SDeliveryWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  padding-top: 24px;
  align-items: baseline;
`;

const SScheduleWrapper = styled(Text.Interactive)<{
  status: OrderStatus;
  isOrderScheduled: boolean;
}>`
  padding: 8px 16px;
  border-radius: 100px;

  ${(props) =>
    props.status === OrderStatus.Ready
      ? css`
          padding-right: 0;
          color: ${theme.textColors.altBlue};
        `
      : undefined};

  ${(props) =>
    props.status === OrderStatus.Approved
      ? css`
          color: ${theme.textColors.blue};
          background: ${theme.colors.lightBlue};
        `
      : undefined};

  ${(props) =>
    props.status === OrderStatus.Approved && props.isOrderScheduled
      ? css`
          color: ${theme.textColors.orange};
          background: ${theme.colors.lightOrange};
        `
      : undefined};

  ${(props) =>
    props.status === OrderStatus.Waiting
      ? css`
          color: ${theme.textColors.blue};
          border: 2px solid ${theme.colors.lightBlue};
        `
      : undefined};

  ${(props) =>
    props.status === OrderStatus.Waiting && props.isOrderScheduled
      ? css`
          color: ${theme.textColors.orange};
          border: 2px solid ${theme.colors.lightOrange};
        `
      : undefined};
`;

interface Props {
  order: Order;
  onClick: (order: Order) => void;
}

export const OrdersTile: React.FC<Props> = ({ order, onClick }) => {
  const scheduleText = useMemo(() => {
    if (order.status === OrderStatus.Ready) {
      return 'Dismiss order';
    }

    if (order.dateScheduled) {
      return dayjs(order.dateScheduled).format('D MMM hh:mm a');
    }

    return 'ASAP';
  }, [order.dateScheduled, order.status]);

  const orderTime = getOrderTime(order);

  const numberOfItems = useMemo(() => {
    let n = 0;

    order.items.forEach((item) => {
      n += item?.quantity ?? 0;
    });

    return n;
  }, [order.items]);

  const roomNumber = order.roomNumber;

  const title = useMemo(() => {
    if (!order.space || !order.pricelist) {
      return 'Unknown Menu';
    }
    return `${order.pricelist.name} from ${order.space.name}`;
  }, [order.pricelist, order.space]);

  return (
    <SWrapper status={order.status} onClick={() => onClick(order)}>
      <SOrderIdWrapper>
        <Text.Descriptor>
          Order #{order?.orderReference?.toUpperCase()}
        </Text.Descriptor>
        <Text.Descriptor>{orderTime}</Text.Descriptor>
      </SOrderIdWrapper>
      <SOrderNameText pt="small">{title}</SOrderNameText>
      <Text.Notes mt={8}>
        {numberOfItems} items • {format.currency(order.totalPrice)}
      </Text.Notes>
      <SDeliveryWrapper>
        <Text.Interactive>{roomNumber}</Text.Interactive>
        <SScheduleWrapper
          status={order.status}
          isOrderScheduled={!!order.dateScheduled}
        >
          {scheduleText}
        </SScheduleWrapper>
      </SDeliveryWrapper>
    </SWrapper>
  );
};
