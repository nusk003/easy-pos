import { Text } from '@src/components/atoms';
import { format } from '@src/util/format';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

const SWrapper = styled.div`
  display: grid;
  padding: ${({ theme }): string => theme.space.medium}px;
  border-radius: 12px;
  border: 0.5px solid #e8eaef;
  gap: 4px;
`;

const SValueWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

interface Props {
  date: Date | string;
  amount?: number;
  estimated?: boolean;
}

export const ManagePaymentsPayoutCards: React.FC<Props> = ({
  amount,
  date,
  estimated,
}) => {
  return (
    <SWrapper>
      <SValueWrapper>
        <Text.Heading>{format.currency(amount || 0)}</Text.Heading>
        <Text.Notes>{moment(date).format('DD-MM-YYYY')}</Text.Notes>
      </SValueWrapper>
      <Text.Notes>
        {estimated ? 'Estimated value (Experimental)' : null}
      </Text.Notes>
    </SWrapper>
  );
};
