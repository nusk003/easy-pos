import { PayoutsStrategy } from '@hm/sdk';
import { Text } from '@src/components/atoms';
import {
  ManagePaymentsHMModal,
  ManagePaymentsPayoutCards,
  ManagePaymentsOverview,
} from '@src/components/organisms';
import { useHMPayPayouts, useHotel } from '@src/xhr/query';
import moment from 'moment';
import React, { useState } from 'react';
import styled from 'styled-components';

const SPayoutsWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 24px;
  margin-bottom: ${({ theme }): string => theme.space.medium}px;

  ${({ theme }): string => theme.mediaQueries.tablet} {
    grid-auto-flow: row;
  }
`;

const SPayoutCardWrapper = styled.div``;

const SNextPayout = styled(SPayoutCardWrapper)`
  grid-column: 1 / 4;

  ${({ theme }): string => theme.mediaQueries.tablet} {
    grid-column: 1 / 8;
  }
`;

const SLastPayout = styled(SPayoutCardWrapper)`
  grid-column: 4 / 7;

  ${({ theme }): string => theme.mediaQueries.tablet} {
    grid-column: 1 / 8;
  }
`;

export const ManagePaymentsHM: React.FC = () => {
  const { data: hotel } = useHotel();
  const { data: payouts } = useHMPayPayouts();

  const [state, setState] = useState({ isModalVisible: false });

  const daysSinceStripeOnboarding = moment(
    hotel?.payouts?.hm?.dateCreated
  ).diff(moment(), 'days');

  const handleClick = async () => {
    setState((s) => ({ ...s, isModalVisible: true }));
  };

  if (!hotel?.payouts?.hm) {
    return null;
  }

  return (
    <>
      <SPayoutsWrapper>
        <SNextPayout>
          <Text.SmallHeading mb="medium">Next Payout</Text.SmallHeading>
          <ManagePaymentsPayoutCards
            date={payouts?.[0]?.arrivalDate}
            amount={payouts?.[0]?.totalPrice}
            estimated
          />
        </SNextPayout>
        <SLastPayout>
          <Text.SmallHeading mb="medium">Last Payout</Text.SmallHeading>
          <ManagePaymentsPayoutCards
            date={payouts?.[1]?.arrivalDate}
            amount={payouts?.[1]?.totalPrice}
            estimated
          />
        </SLastPayout>
      </SPayoutsWrapper>
      {daysSinceStripeOnboarding < 14 ? (
        <Text.Descriptor mb="medium">
          It may take some time for your first payout to come through whilst
          Stripe is processing your account. You will still be able to take
          payments in this timeframe.
        </Text.Descriptor>
      ) : null}
      <ManagePaymentsOverview
        provider={PayoutsStrategy.HotelManagerPay}
        payoutSchedule={hotel.payouts.hm.payoutSchedule || undefined}
        accountNumberLast4={hotel.payouts.hm.accountNumberLast4}
        sortCode={hotel.payouts.hm.sortCode}
        onClick={handleClick}
        buttonText="More"
        payoutsEnabled
        paymentsEnabled
      />
      <ManagePaymentsHMModal
        visible={state.isModalVisible}
        onClose={() =>
          setState((s) => ({ ...s, isModalVisible: !s.isModalVisible }))
        }
        accountNumberLast4={hotel?.payouts?.hm?.accountNumberLast4}
        sortCode={hotel?.payouts?.hm?.sortCode as string}
        payoutsEnabled
        paymentsEnabled
      />
    </>
  );
};
