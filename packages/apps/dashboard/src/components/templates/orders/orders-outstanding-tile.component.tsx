import { Order, OutstandingGuest, PaymentType } from '@hm/sdk';
import {
  OrdersOutstandingGuestsTile,
  OrdersOutstandingOrdersTile,
} from '@src/components/organisms';
import { sdk } from '@src/xhr/graphql-request';
import React, { useState } from 'react';
import styled from 'styled-components';

const SWrapper = styled.div``;

const SGuestOrdersWrapper = styled.div`
  margin-top: 16px;
  margin-left: 16px;
  display: grid;
  gap: 16px;
`;

export interface OnSettleOrdersOptions {
  outstandingGuest?: OutstandingGuest;
  outstandingOrder?: Order;
  setOutstandingGuestOrders?: React.Dispatch<React.SetStateAction<Order[]>>;
  paymentType: PaymentType;
}

interface Props {
  outstandingGuest?: OutstandingGuest;
  outstandingOrder?: Order;
  paymentType: PaymentType;
  onSettleOrders: (args: OnSettleOrdersOptions) => void;
}

export const OrdersOutstandingTile: React.FC<Props> = ({
  outstandingGuest,
  outstandingOrder,
  paymentType,
  onSettleOrders,
}) => {
  const [outstandingGuestOrders, setOutstandingGuestOrders] = useState<Order[]>(
    []
  );

  const loadGuestOrders = async (outstandingGuest: OutstandingGuest) => {
    const outstandingGuestOrders = await sdk.searchOutstandingOrders({
      guestId: outstandingGuest.guest.id,
      paymentType:
        paymentType === ('roomBill' as PaymentType)
          ? PaymentType.RoomBill
          : PaymentType.Cash,
    });

    setOutstandingGuestOrders(
      outstandingGuestOrders.searchOutstandingOrders.data as Order[]
    );
  };

  return (
    <SWrapper>
      {outstandingGuest ? (
        <OrdersOutstandingGuestsTile
          outstandingGuest={outstandingGuest}
          onDropdownClick={loadGuestOrders}
          collapsed={!outstandingGuestOrders.length}
          onSettleGuest={(outstandingGuest) =>
            onSettleOrders({ outstandingGuest, paymentType })
          }
        />
      ) : (
        <OrdersOutstandingOrdersTile
          outstandingOrder={outstandingOrder!}
          onSettleOrder={(outstandingOrder) =>
            onSettleOrders({
              outstandingOrder,
              paymentType,
            })
          }
        />
      )}

      {outstandingGuestOrders.length ? (
        <SGuestOrdersWrapper>
          {outstandingGuestOrders.map((guestOrder) => {
            return (
              <OrdersOutstandingOrdersTile
                key={guestOrder.id}
                outstandingOrder={guestOrder}
                onSettleOrder={(outstandingOrder) =>
                  onSettleOrders({
                    outstandingOrder,
                    paymentType,
                    setOutstandingGuestOrders,
                  })
                }
              />
            );
          })}
        </SGuestOrdersWrapper>
      ) : null}
    </SWrapper>
  );
};
