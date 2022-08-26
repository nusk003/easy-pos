import { PaymentType } from '@hm/sdk';
import { OrdersOutstandingOverviewTile } from '@src/components/organisms';
import { OrdersOutstandingModal } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { useIsPMSActive } from '@src/util/integrations';
import { useOutstandingOrdersStatistics } from '@src/xhr/query';
import React, { useState } from 'react';
import styled from 'styled-components';

const SWrapper = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(12, 1fr);

  ${theme.mediaQueries.laptop} {
    grid-template-columns: repeat(8, 1fr);
  }

  ${theme.mediaQueries.tablet} {
    gap: 16px;
    grid-template-columns: auto;

    > div {
      grid-area: unset;
    }
  }
`;

export const OrdersOutstandingOverview: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [paymentType, setPaymentType] = useState(PaymentType.Cash);

  const { data } = useOutstandingOrdersStatistics();

  const outstandingOrdersStatistics = data || {
    cash: {
      noGuests: 0,
      noOrders: 0,
      paymentType: PaymentType.Cash,
      totalPrice: 0,
    },
    roomBill: {
      noGuests: 0,
      noOrders: 0,
      paymentType: PaymentType.RoomBill,
      totalPrice: 0,
    },
  };

  const isPMSActive = useIsPMSActive();

  const toggleModal = (paymentType: PaymentType) => {
    setIsModalVisible(true);
    setPaymentType(paymentType);
  };

  return (
    <>
      <SWrapper key={String(isModalVisible)}>
        <OrdersOutstandingOverviewTile
          gridArea="1 / 1 / 2 / 5"
          onClick={toggleModal}
          outstandingOrdersStatistics={outstandingOrdersStatistics.cash}
          key={outstandingOrdersStatistics.cash.paymentType}
        />
        {!isPMSActive ? (
          <OrdersOutstandingOverviewTile
            gridArea="1 / 5 / 2 / 9"
            onClick={toggleModal}
            outstandingOrdersStatistics={outstandingOrdersStatistics.roomBill}
            key={outstandingOrdersStatistics.roomBill.paymentType}
          />
        ) : null}
      </SWrapper>
      <OrdersOutstandingModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        paymentType={paymentType}
      />
    </>
  );
};
