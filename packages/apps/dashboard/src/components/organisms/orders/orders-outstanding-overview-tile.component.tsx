import { OutstandingOrdersStatistics, PaymentType } from '@hm/sdk';
import { Link, Text } from '@src/components/atoms';
import { format } from '@src/util/format';
import React from 'react';
import styled from 'styled-components';

interface TileWrapperProps {
  gridArea: string;
}

const STileWrapper = styled.div<TileWrapperProps>`
  display: grid;
  grid-area: ${(props): string => props.gridArea};
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  grid-gap: 6px;
`;

const SSpaceBetween = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
`;

interface Props {
  outstandingOrdersStatistics: OutstandingOrdersStatistics;
  gridArea: string;
  onClick: (paymentType: PaymentType) => void;
}

export const OrdersOutstandingOverviewTile: React.FC<Props> = ({
  outstandingOrdersStatistics,
  gridArea,
  onClick,
}) => {
  const { noGuests, noOrders, paymentType, totalPrice } =
    outstandingOrdersStatistics;

  return (
    <STileWrapper gridArea={gridArea}>
      <SSpaceBetween>
        <Text.MediumHeading>
          {paymentType === PaymentType.Cash
            ? 'Paid in person'
            : 'Added to final bill'}
        </Text.MediumHeading>
        <Link onClick={() => onClick(paymentType)} disableOnClick={false}>
          Manage
        </Link>
      </SSpaceBetween>
      <SSpaceBetween>
        <Text.Descriptor>
          {noOrders} orders • {noGuests} guests
        </Text.Descriptor>
        <Text.BodyBold>
          {!Number.isNaN(totalPrice) ? format.currency(totalPrice) : totalPrice}
        </Text.BodyBold>
      </SSpaceBetween>
    </STileWrapper>
  );
};
