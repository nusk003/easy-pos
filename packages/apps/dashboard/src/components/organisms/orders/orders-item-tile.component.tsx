import { OrderItem } from '@hm/sdk';
import { Text } from '@src/components/atoms';
import { format } from '@src/util/format';
import React from 'react';
import styled from 'styled-components';

const SWrapper = styled.div`
  display: grid;
  grid-template-columns: min-content auto min-content;
  gap: 8px;
`;

interface Props {
  item: OrderItem;
}

export const OrdersItemTile: React.FC<Props> = ({ item }) => {
  const options: Array<string> = [];

  if (item.modifiers) {
    item.modifiers.map((modifier): number => {
      if (modifier) {
        modifier.options.forEach((option) => {
          options.push(option.name);
        });
      }
      return 0;
    });
  }

  const optionText = options.length ? options.join(', ') : null;

  return (
    <div>
      <SWrapper>
        <Text.Body fontWeight="semibold">{item.quantity}x</Text.Body>
        <Text.Body>{item.name}</Text.Body>
        <Text.Body fontWeight="medium">
          {format.currency(item.totalPrice)}
        </Text.Body>
      </SWrapper>
      {optionText ? <Text.Descriptor>{optionText}</Text.Descriptor> : null}
    </div>
  );
};
