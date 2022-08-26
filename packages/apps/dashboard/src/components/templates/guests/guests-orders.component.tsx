import { GuestWithStatistics, Order } from '@hm/sdk';
import { Link, Text } from '@src/components/atoms';
import { Card } from '@src/components/molecules';
import { GuestsOrderTile } from '@src/components/organisms';
import { OrdersModal } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { format } from '@src/util/format';
import { useSpaceDetails } from '@src/util/spaces';
import { useOrders } from '@src/xhr/query';
import moment from 'moment';
import React, { useState } from 'react';
import { ImPriceTag } from 'react-icons/im';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const SWrappper = styled.div``;

const SContentWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-column-gap: 24px;

  ${theme.mediaQueries.desktop} {
    grid-column-gap: 0;
    grid-row-gap: 24px;
  }
`;

const SOrderCard = styled(Card)`
  cursor: pointer;
  user-select: none;
  grid-column: 1 / 5;
  ${theme.mediaQueries.desktop} {
    grid-column: 1 / 9;
  }
`;

const SOrderCardContentWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: max-content;
  gap: 16px;
  align-items: center;
`;

const SOrderInformationWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: flex-end;
`;

const SIconWrapper = styled.div`
  display: grid;
  border-radius: 8px;
  padding: 24px;
  font-size: 20px;
  background: ${theme.colors.lightBlue};
  color: ${theme.colors.blue};
  justify-content: center;
  align-content: center;
  height: 72px;
  width: 72px;
  box-sizing: border-box;
`;

const SAllOrdersWrapper = styled.div`
  display: grid;
  gap: 16px;
  grid-template-rows: min-content;

  grid-column: 5 / 9;
  ${theme.mediaQueries.desktop} {
    grid-column: 1 / 9;
  }
`;

interface Props {
  guest: GuestWithStatistics;
}

export const GuestsOrders: React.FC<Props> = ({ guest }) => {
  const history = useHistory();

  const { data: orders } = useOrders({ guestId: guest.id });

  const { space: lastOrderSpace } = useSpaceDetails({
    pricelistId: orders?.[0]?.pricelist.id,
  });

  const [state, setState] = useState<{
    isOrderModalVisible: boolean;
    order: Order | undefined;
  }>({
    isOrderModalVisible: false,
    order: undefined,
  });

  const toggleOrderModal = (order?: Order) => {
    setState((s) => ({
      ...s,
      isOrderModalVisible: !s.isOrderModalVisible,
      order: order || s.order,
    }));
  };

  return (
    <>
      <SWrappper>
        <Text.SuperHeading mb="medium">Orders</Text.SuperHeading>
        <SContentWrapper>
          <SOrderCard
            cardStyle="light-blue"
            onClick={orders ? () => toggleOrderModal(orders[0]) : undefined}
          >
            {orders ? (
              <Text.MediumHeading mb="medium">Last Order</Text.MediumHeading>
            ) : null}
            <SOrderCardContentWrapper>
              <SIconWrapper>
                <ImPriceTag />
              </SIconWrapper>
              {orders ? (
                <SOrderInformationWrapper>
                  <div>
                    <Text.Primary fontWeight="medium">
                      {lastOrderSpace?.name}
                    </Text.Primary>
                    <Text.Primary>
                      {orders[0].items.length}{' '}
                      {orders[0].items.length === 1 ? 'item' : 'items'}
                    </Text.Primary>
                    <Text.Primary>
                      {moment(orders[0].dateCreated).format('MMM Do')}
                    </Text.Primary>
                  </div>

                  <Text.Primary textAlign="right">
                    {format.currency(orders[0].totalPrice)}
                  </Text.Primary>
                </SOrderInformationWrapper>
              ) : (
                <Text.Primary>
                  This guest has not made any orders yet.
                </Text.Primary>
              )}
            </SOrderCardContentWrapper>
          </SOrderCard>
          {orders && (guest?.ordersCount || 0) > 1 ? (
            <SAllOrdersWrapper>
              <Text.Heading>All orders ({guest?.ordersCount})</Text.Heading>
              {orders.slice(1, 3).map((order) => (
                <GuestsOrderTile
                  onClick={() => toggleOrderModal(order)}
                  order={order}
                  key={order.id}
                />
              ))}
              <Link
                onClick={() =>
                  history.push('/orders/all', { guestId: guest.id })
                }
              >
                See all {'->'}
              </Link>
            </SAllOrdersWrapper>
          ) : null}
        </SContentWrapper>
      </SWrappper>
      <OrdersModal
        visible={state.isOrderModalVisible}
        onClose={toggleOrderModal}
        order={state.order}
      />
    </>
  );
};
