import { Order, PricelistDeliveryType } from '@hm/sdk';
import { Button, CircleIcon, Text } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import { format } from '@src/util/format';
import { useSpaceDetails } from '@src/util/spaces';
import React from 'react';
import { FaConciergeBell } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import styled from 'styled-components';

const STopLevelWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
`;

const SContentWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
`;

const SInformationWrapper = styled.div`
  display: grid;
  gap: 2px;
`;

const STitleText = styled(Text.Body)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface Props {
  outstandingOrder: Order;
  onSettleOrder: (outstandingOrder: Order) => void;
}

export const OrdersOutstandingOrdersTile: React.FC<Props> = ({
  outstandingOrder,
  onSettleOrder,
}) => {
  const { space, pricelist } = useSpaceDetails({
    pricelistId: outstandingOrder.pricelist.id,
  });

  return (
    <STopLevelWrapper>
      <CircleIcon
        icon={FaConciergeBell}
        color={theme.colors.altBlue}
        width={32}
        innerWidth={12}
      />
      <SContentWrapper>
        <SInformationWrapper>
          <STitleText pr="8px" fontWeight="medium">
            {pricelist?.name} from {space?.name}
          </STitleText>

          <Text.Descriptor>
            {outstandingOrder.guest.firstName} {outstandingOrder.guest.lastName}{' '}
            •{' '}
            {outstandingOrder.delivery === PricelistDeliveryType.Room
              ? 'Room'
              : outstandingOrder.delivery === PricelistDeliveryType.Table
              ? 'Table'
              : null}{' '}
            {outstandingOrder.roomNumber}
          </Text.Descriptor>
        </SInformationWrapper>

        <Button
          preventDoubleClick
          onClick={() => onSettleOrder(outstandingOrder)}
          buttonStyle="secondary"
          ml="8px"
        >
          Settle {format.currency(outstandingOrder.totalPrice)}
        </Button>
      </SContentWrapper>
    </STopLevelWrapper>
  );
};
