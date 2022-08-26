import { Order } from '@hm/sdk';
import { CircleIcon, Link } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import { format } from '@src/util/format';
import { useSpaceDetails } from '@src/util/spaces';
import moment from 'moment';
import React from 'react';
import { ImPriceTag } from 'react-icons/im';
import styled from 'styled-components';

const SWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: min-content;
  height: min-content;
`;

const SLink = styled(Link)`
  width: auto;
`;

interface Props {
  order: Order;
  onClick: () => void;
}

export const GuestsOrderTile: React.FC<Props> = ({ order, onClick }) => {
  if (!order.space && !order.pricelist) {
    return null;
  }

  return (
    <SWrapper>
      <CircleIcon
        icon={ImPriceTag}
        color={theme.colors.blue}
        background={theme.colors.lightBlue}
      />
      <SLink disableOnClick={false} onClick={onClick} interactive>
        {moment(order.dateCreated).format('MMM Do')} - {order.pricelist?.name}{' '}
        from {order.space?.name} ({format.currency(order.totalPrice)})
      </SLink>
    </SWrapper>
  );
};
