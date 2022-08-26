import { GuestWithStatistics } from '@hm/sdk';
import { Text } from '@src/components/atoms';
import { Card } from '@src/components/molecules';
import { theme } from '@src/components/theme';
import { format } from '@src/util/format';
import React from 'react';
import styled from 'styled-components';

interface SWrapperProps {
  numberOfMetrics: number;
}

const SWrappper = styled.div<SWrapperProps>`
  display: ${(props) => (props.numberOfMetrics > 1 ? 'grid' : 'block')};
  grid-template-columns: repeat(8, 1fr);
  grid-column-gap: 24px;
`;

const SCardBase = styled(Card)`
  display: grid;
  gap: 16px;
`;

const SAppSpend = styled(SCardBase)`
  grid-column: 1 / 4;
  ${theme.mediaQueries.desktop} {
    grid-column: 1 / 5;
  }
`;

interface Props {
  guest: GuestWithStatistics;
}

export const GuestsMetricsOverview: React.FC<Props> = ({ guest }) => {
  if (!guest || !guest.totalSpend) {
    return null;
  }

  const numberOfMetrics = guest.totalSpend ? 1 : 0;

  return (
    <SWrappper numberOfMetrics={numberOfMetrics}>
      {guest.totalSpend ? (
        <SAppSpend cardStyle="light-blue">
          <Text.Interactive>In App Spend</Text.Interactive>
          <Text.Heading fontWeight="medium">
            {format.currency(guest.totalSpend)}
          </Text.Heading>
        </SAppSpend>
      ) : null}
    </SWrappper>
  );
};
