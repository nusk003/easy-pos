import {
  calculateDiscountValue,
  calculateSurcharges,
  getOrderTime,
} from '@hm/orders';
import {
  Order,
  OrderStatus,
  PricelistDeliveryType,
  PricelistMultiplierType,
} from '@hm/sdk';
import {
  Button,
  ButtonStyle,
  Grid,
  Link,
  Row,
  Text,
  toast,
  Tooltip,
} from '@src/components/atoms';
import { theme } from '@src/components/theme';
import { format } from '@src/util/format';
import { getReadablePaymentMethod } from '@src/util/orders';
import { getCardIcon } from '@src/util/payments';
import { sdk } from '@src/xhr/graphql-request';
import { useOrders } from '@src/xhr/query';
import dayjs from 'dayjs';
import _ from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { BiInfoCircle } from 'react-icons/bi';
import { MdShortText } from 'react-icons/md';
import styled, { css } from 'styled-components';
import { OrdersItemTile } from './orders-item-tile.component';

const SWrapper = styled.div`
  height: fit-content;
  max-width: 600px;
  padding: 24px;
`;

const SScheduleWrapper = styled(Text.Interactive)<{
  status: OrderStatus;
  isOrderScheduled: boolean;
}>`
  padding: 8px 16px;
  border-radius: 100px;
  white-space: nowrap;

  ${(props) =>
    props.status === OrderStatus.Completed
      ? css`
          padding-right: 0;
        `
      : undefined};

  ${(props) =>
    props.status === OrderStatus.Ready
      ? css`
          padding-right: 0;
          color: ${theme.textColors.altBlue};
        `
      : undefined};

  ${(props) =>
    props.status === OrderStatus.Ready && props.isOrderScheduled
      ? css`
          color: ${theme.textColors.orange};
          border: 2px solid ${theme.colors.lightOrange};
          padding-right: 16px;
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

const SNotesWrapper = styled.div`
  margin: 0 -24px;
  margin-top: 12px;
  padding: 16px 32px;
  background: ${theme.colors.offWhite};
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  justify-content: start;
`;

const SPaymentDetailsWrapper = styled.div`
  display: grid;
  padding-top: 24px;
`;

const SItemsWrapper = styled.div`
  padding-top: 24px;
  display: grid;
  gap: 16px;
`;

const SGuestDetailsWrapper = styled.div`
  margin-top: 16px;
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
`;

const SCardDetailsWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  user-select: none;
`;

const SActionWrapper = styled.div`
  margin-top: 16px;
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const SCardIcon = styled.img`
  width: 36px;
  height: 24px;
  margin-right: 4px;
`;

interface Props {
  order: Order;
  onClose: () => void;
  onReject: () => void;
}

export const OrdersModalDetails: React.FC<Props> = ({
  order,
  onReject,
  onClose,
}) => {
  const { mutate: mutateOrders } = useOrders();

  const [loading, setLoading] = useState(false);

  const orderTime = useMemo(() => getOrderTime(order), [order]);

  const scheduleText = useMemo(() => {
    if (order.dateScheduled) {
      return dayjs(order.dateScheduled).format('D MMM hh:mm a');
    }

    return 'ASAP';
  }, [order.dateScheduled]);

  const surcharges = useMemo(() => calculateSurcharges(order), [order]);

  const paymentMethod = useMemo(
    () => getReadablePaymentMethod(order.paymentType),
    [order.paymentType]
  );

  const title = useMemo(() => {
    if (!order.space || !order.pricelist) {
      return 'Unknown Menu';
    }
    return `${order.pricelist.name} from ${order.space.name}`;
  }, [order.pricelist, order.space]);

  const submitText = useMemo(() => {
    if (order.status === OrderStatus.Ready) {
      return 'Dismiss order';
    }

    if (order.status === OrderStatus.Approved) {
      return 'Complete order';
    }

    if (order.status === OrderStatus.Waiting) {
      return 'Approve order';
    }

    return undefined as never;
  }, [order.status]);

  const submitButtonStyle: ButtonStyle = useMemo(() => {
    if (order.status === OrderStatus.Ready) {
      return 'primary';
    }

    if (order.status === OrderStatus.Approved) {
      return 'secondary';
    }

    if (order.status === OrderStatus.Waiting) {
      return 'primary';
    }

    return undefined as never;
  }, [order.status]);

  const handleSubmit = useCallback(async () => {
    const action =
      order.status === OrderStatus.Ready
        ? OrderStatus.Completed
        : order.status === OrderStatus.Approved
        ? OrderStatus.Ready
        : order.status === OrderStatus.Waiting
        ? OrderStatus.Approved
        : (undefined as never);

    const toastTextLoading =
      order.status === OrderStatus.Ready
        ? `Dismissing Order #${order.orderReference?.toUpperCase()}`
        : order.status === OrderStatus.Approved
        ? `Completing Order #${order.orderReference?.toUpperCase()}`
        : order.status === OrderStatus.Waiting
        ? `Approving Order #${order.orderReference?.toUpperCase()}`
        : (undefined as never);

    const toastTextCompleted =
      order.status === OrderStatus.Ready
        ? `Successfully dismissed Order #${order.orderReference?.toUpperCase()}`
        : order.status === OrderStatus.Approved
        ? `Successfully completed Order #${order.orderReference?.toUpperCase()}`
        : order.status === OrderStatus.Waiting
        ? `Successfully approved Order #${order.orderReference?.toUpperCase()}`
        : (undefined as never);

    const toastId = toast.loader(toastTextLoading);
    setLoading(true);

    try {
      mutateOrders((orders) => {
        if (!orders) {
          return orders;
        }

        const orderIdx = orders?.findIndex(({ id }) => id === order.id);

        const newOrders = _.cloneDeep(orders);

        if (orderIdx && orderIdx > -1) {
          const order = newOrders[orderIdx];
          order.status = action;
          newOrders[orderIdx] = order;
        }

        return newOrders;
      }, false);

      await sdk.updateOrder({
        where: { id: order.id },
        data: { status: action },
      });

      toast.update(toastId, toastTextCompleted);
      onClose();
    } catch {
      await mutateOrders();

      toast.update(
        toastId,
        `Unable to process Order #${order.orderReference?.toUpperCase()}`
      );
    }

    setLoading(false);
  }, [mutateOrders, onClose, order.id, order.orderReference, order.status]);

  return (
    <SWrapper>
      <Grid
        gridAutoFlow="column"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text.Descriptor>
          Order #{order.orderReference?.toUpperCase()}
        </Text.Descriptor>
        <Text.Descriptor>{orderTime}</Text.Descriptor>
      </Grid>
      <Grid
        gridAutoFlow="column"
        alignItems="center"
        justifyContent="space-between"
        pt="16px"
      >
        <Text.MediumHeading fontWeight="medium" pr="24px">
          {title}
        </Text.MediumHeading>
        <SScheduleWrapper
          status={order.status}
          isOrderScheduled={!!order.dateScheduled}
        >
          {scheduleText}
        </SScheduleWrapper>
      </Grid>
      {order.notes ? (
        <SNotesWrapper>
          <MdShortText size={26} color={theme.textColors.lightGray} />
          <Text.Descriptor ml="8px">{order.notes}</Text.Descriptor>
        </SNotesWrapper>
      ) : null}
      <SItemsWrapper>
        {order.items.map((item, idx) => {
          return <OrdersItemTile key={idx} item={item} />;
        })}
      </SItemsWrapper>

      <SPaymentDetailsWrapper>
        <Grid
          gridAutoFlow="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text.Descriptor>Subtotal</Text.Descriptor>
          <Text.Descriptor>
            {format.currency(order.subtotal || 0)}
          </Text.Descriptor>
        </Grid>

        {surcharges?.map((surcharge) => {
          return (
            <Grid
              gridAutoFlow="column"
              alignItems="center"
              justifyContent="space-between"
              key={surcharge.id}
              mt="2px"
            >
              {surcharge.name.length < 32 ? (
                <Text.Descriptor>{surcharge.name}</Text.Descriptor>
              ) : (
                <Row alignItems="flex-end">
                  <div>
                    {surcharge.type === PricelistMultiplierType.Absolute
                      ? format.currency(surcharge.value)
                      : format.percentage(surcharge.value)}{' '}
                    charge&nbsp;
                  </div>
                  <Tooltip message={surcharge.name}>
                    <BiInfoCircle />
                  </Tooltip>
                </Row>
              )}

              <Text.Descriptor>
                +
                {format.currency(
                  Math.round((surcharge.value + Number.EPSILON) * 100) / 100
                )}
              </Text.Descriptor>
            </Grid>
          );
        })}

        {order.discount ? (
          <Grid
            gridAutoFlow="column"
            alignItems="center"
            justifyContent="space-between"
            mt="2px"
          >
            {order.discount.name.length < 32 ? (
              <Text.Descriptor>{order.discount.name}</Text.Descriptor>
            ) : (
              <Row alignItems="flex-end">
                <Text.Descriptor>
                  {format.percentage(order.discount.value * 100)} discount&nbsp;
                </Text.Descriptor>
                <Tooltip message={order.discount.name}>
                  <BiInfoCircle />
                </Tooltip>
              </Row>
            )}
            <Text.Descriptor>
              -{format.currency(calculateDiscountValue(order))}
            </Text.Descriptor>
          </Grid>
        ) : null}

        <Grid
          gridAutoFlow="column"
          alignItems="center"
          justifyContent="space-between"
          mt="16px"
        >
          <Text.Primary fontWeight="medium">Total</Text.Primary>
          <Text.Primary fontWeight="medium">
            {format.currency(order.totalPrice || 0)}
          </Text.Primary>
        </Grid>

        {paymentMethod !== 'None' ? (
          <Grid
            gridAutoFlow="column"
            alignItems="center"
            justifyContent="space-between"
            mt="16px"
          >
            <Text.Descriptor>Payment Method</Text.Descriptor>
            <div>
              {paymentMethod !== 'Card' ? (
                <Text.Descriptor color={theme.textColors.orange}>
                  {paymentMethod}
                </Text.Descriptor>
              ) : (
                <SCardDetailsWrapper>
                  <SCardIcon
                    src={getCardIcon(order.cardDetails?.brand)}
                    alt=""
                  />
                  <Text.Body>••••</Text.Body>
                  {order.cardDetails?.last4}
                </SCardDetailsWrapper>
              )}
            </div>
          </Grid>
        ) : null}
      </SPaymentDetailsWrapper>

      <SGuestDetailsWrapper>
        <div>
          <Text.Body>
            {order.delivery === PricelistDeliveryType.Room
              ? 'Room'
              : order.delivery === PricelistDeliveryType.Table
              ? 'Table'
              : null}
          </Text.Body>
          <Text.Body mt="4px" fontWeight="semibold">
            {order.roomNumber}
          </Text.Body>
        </div>
        {order.guest.firstName ? (
          <div>
            <Text.Body textAlign="right">Guest</Text.Body>
            <Text.Body mt="4px" fontWeight="semibold" textAlign="right">
              {order.guest.firstName} {order.guest.lastName}
            </Text.Body>
          </div>
        ) : null}
      </SGuestDetailsWrapper>

      {submitText ? (
        <SActionWrapper>
          <div>
            {order.status === OrderStatus.Waiting ? (
              <Link color={theme.textColors.red} onClick={onReject}>
                Unable to process order
              </Link>
            ) : null}
          </div>
          <Button
            buttonStyle={submitButtonStyle}
            onClick={handleSubmit}
            loading={loading}
          >
            {submitText}
          </Button>
        </SActionWrapper>
      ) : null}
    </SWrapper>
  );
};
