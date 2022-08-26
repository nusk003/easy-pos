import { PricelistDeliveryType, PricelistSurcharge } from '@hm/sdk';
import { Link, Tag, Text, Tooltip } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import React from 'react';
import styled from 'styled-components';

const SWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  align-items: center;
  gap: 8px;
`;

interface Props {
  surcharge: PricelistSurcharge;
  onEdit: (surcharge: PricelistSurcharge) => void;
  onDelete: (surcharge: PricelistSurcharge) => void;
}

export const ManageFoodBeverageSurchargeTile: React.FC<Props> = ({
  surcharge,
  onDelete,
  onEdit,
}) => {
  const isLive =
    surcharge?.delivery?.some(
      (d) => d.type === PricelistDeliveryType.Room && d.enabled
    ) ||
    surcharge?.delivery?.some(
      (d) => d.type === PricelistDeliveryType.Table && d.enabled
    );

  return (
    <SWrapper>
      <Tooltip
        message={!isLive ? 'Surcharge has no enabled fulfilment options' : ''}
      >
        <Tag tagStyle={isLive ? 'blue' : 'red'}>
          {isLive ? 'Live' : 'Disabled'}
        </Tag>
      </Tooltip>
      <Text.Body fontWeight="medium">{surcharge.name}</Text.Body>
      <Link disableOnClick={false} onClick={() => onEdit(surcharge)}>
        Edit
      </Link>
      <Link color={theme.textColors.red} onClick={() => onDelete(surcharge)}>
        Delete
      </Link>
    </SWrapper>
  );
};
