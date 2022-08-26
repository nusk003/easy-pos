import { PayoutsStrategy } from '@hm/sdk';
import { Text, toast } from '@src/components/atoms';
import {
  ManagePaymentsPayoutCards,
  ManagePaymentsOverview,
  ManagePaymentsStripeModal,
} from '@src/components/organisms';
import { sdk } from '@src/xhr/graphql-request';
import { useHotel, useStripeAccount, useStripePayouts } from '@src/xhr/query';
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

const SLastPayout = styled(SPayoutCardWrapper)`
  width: 50%;

  ${({ theme }) => theme.mediaQueries.tablet} {
    width: 100%;
  }
`;

export const ManagePaymentsStripe: React.FC = () => {
  const { data: hotel, mutate: mutateHotel } = useHotel();
  const { data: payouts } = useStripePayouts();
  const { data: stripeAccount, mutate: mutateStripeAccount } =
    useStripeAccount();

  const isLinkedAccount = hotel?.payouts?.stripe?.linked;

  const [state, setState] = useState({ isModalVisible: false });

  let verificationStatus = '';
  if (stripeAccount?.paymentsEnabled && stripeAccount?.payoutsEnabled) {
    verificationStatus = 'complete';
  }
  if (!stripeAccount?.paymentsEnabled && !stripeAccount?.payoutsEnabled) {
    verificationStatus = 'stripeBusinessVerification';
  } else if (
    !stripeAccount?.payoutsEnabled &&
    !stripeAccount?.accountNumberLast4
  ) {
    verificationStatus = 'bankAccountVerification';
  } else if (!stripeAccount?.payoutsEnabled) {
    verificationStatus = 'stripeIdentityVerification';
  }

  let buttonText = '';
  if (isLinkedAccount) {
    buttonText = 'Stripe Account →';
  } else if (verificationStatus === 'complete') {
    buttonText = 'More';
  } else if (verificationStatus === 'stripeBusinessVerification') {
    buttonText = 'Continue Stripe Onboarding';
  } else if (verificationStatus === 'bankAccountVerification') {
    buttonText = 'Enter bank account details';
  } else if (verificationStatus === 'stripeIdentityVerification') {
    buttonText = 'Verify Stripe Account';
  }

  const daysSinceStripeOnboarding = moment(
    hotel?.payouts?.stripe?.dateCreated
  ).diff(moment(), 'days');

  const handleClick = async () => {
    if (isLinkedAccount) {
      window.open('https://dashboard.stripe.com/', '_blank');
      return;
    }

    if (
      verificationStatus === 'stripeBusinessVerification' ||
      verificationStatus === 'stripeIdentityVerification'
    ) {
      await mutateStripeAccount();

      if (stripeAccount?.accountLink) {
        window.location.href = stripeAccount.accountLink;
      } else {
        toast.info('Unable to process. Please try again later.');
      }
    } else if (
      verificationStatus === 'bankAccountVerification' ||
      verificationStatus === 'complete'
    ) {
      setState((s) => ({ ...s, isModalVisible: true }));
    }
  };

  const handleDisablePayments = async () => {
    try {
      await sdk.disableHotelPayouts();
      toast.info('Successfully disabled payments');
      await mutateHotel();
    } catch {
      toast.info('Unable to process request');
    }
  };
  if (stripeAccount && Object.keys(stripeAccount).length) {
    return (
      <>
        <SPayoutsWrapper>
          <SLastPayout>
            <Text.SmallHeading mb="medium">Last Payout</Text.SmallHeading>
            <ManagePaymentsPayoutCards
              date={payouts?.[1]?.arrivalDate}
              amount={payouts?.[1]?.totalPrice}
            />
          </SLastPayout>
        </SPayoutsWrapper>
        {!isLinkedAccount && daysSinceStripeOnboarding < 14 ? (
          <Text.Descriptor mb="medium">
            It may take some time for your first payout to come through whilst
            Stripe is processing your account. You will still be able to take
            payments in this timeframe.
          </Text.Descriptor>
        ) : null}
        <ManagePaymentsOverview
          provider={PayoutsStrategy.Stripe}
          payoutSchedule={stripeAccount?.payoutSchedule || undefined}
          accountNumberLast4={stripeAccount?.accountNumberLast4 || undefined}
          sortCode={stripeAccount?.sortCode || undefined}
          onClick={handleClick}
          onDisable={handleDisablePayments}
          disableButtonText="Disable"
          buttonText={buttonText}
          payoutsEnabled={stripeAccount.payoutsEnabled}
          paymentsEnabled={stripeAccount.paymentsEnabled}
          stripeAccountLink={stripeAccount.accountLink || undefined}
        />
        <ManagePaymentsStripeModal
          visible={state.isModalVisible}
          onClose={() => {
            mutateStripeAccount();
            setState((s) => ({ ...s, isModalVisible: !s.isModalVisible }));
          }}
          accountNumberLast4={stripeAccount?.accountNumberLast4 || undefined}
          sortCode={stripeAccount?.sortCode || undefined}
          payoutsEnabled={stripeAccount?.payoutsEnabled}
          paymentsEnabled={stripeAccount?.paymentsEnabled}
          payoutSchedule={stripeAccount?.payoutSchedule || undefined}
        />
      </>
    );
  }

  return null;
};
