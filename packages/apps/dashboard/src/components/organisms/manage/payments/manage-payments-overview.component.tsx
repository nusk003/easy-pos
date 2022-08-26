import {
  HmPayAccountPayoutSchedule,
  PayoutInterval,
  PayoutsStrategy,
} from '@hm/sdk';
import HMPayLogoSrc from '@src/assets/payments/hm-pay-logo.png';
import StripeLogoSrc from '@src/assets/payments/stripe-logo.png';
import { Button, Grid, Row, Tag, Text } from '@src/components/atoms';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { color, ColorProps } from 'styled-system';

const capitalize = (string: string): string => {
  return string[0].toUpperCase() + string.slice(1);
};

const SWrapper = styled.div`
  padding: ${({ theme }): string => theme.space.medium}px;
  border-radius: 12px;
  box-shadow: 0px 4px 16px rgba(18, 45, 115, 0.1);
`;

const SIndicator = styled.div<ColorProps>`
  height: 6px;
  width: 6px;
  border-radius: 3px;
  ${color}
`;

const HMPayLogo = styled.img.attrs({
  src: HMPayLogoSrc,
  alt: '',
})`
  height: 40px;
`;

const StripeLogo = styled.img.attrs({
  src: StripeLogoSrc,
  alt: '',
})`
  height: 40px;
`;

interface Props {
  provider: PayoutsStrategy;
  payoutSchedule?: HmPayAccountPayoutSchedule;
  accountNumberLast4?: string;
  sortCode?: string;
  onClick: () => void;
  buttonText: string;
  onDisable?: () => void;
  disableButtonText?: string;
  payoutsEnabled: boolean;
  paymentsEnabled: boolean;
  stripeAccountLink?: string;
}

export const ManagePaymentsOverview: React.FC<Props> = ({
  provider,
  payoutSchedule,
  accountNumberLast4,
  sortCode,
  onClick,
  buttonText,
  onDisable,
  disableButtonText,
  payoutsEnabled,
  paymentsEnabled,
  stripeAccountLink,
}) => {
  let payoutScheduleText = '';
  if (payoutSchedule?.interval === PayoutInterval.Daily) {
    payoutScheduleText = 'Every day';
  } else if (payoutSchedule?.interval === PayoutInterval.Weekly) {
    payoutScheduleText = `Every ${capitalize(payoutSchedule?.date as string)}`;
  } else if (payoutSchedule?.interval === PayoutInterval.Monthly) {
    payoutScheduleText = `${moment
      .localeData()
      .ordinal(Number(payoutSchedule?.date))} of each month`;
  }

  let tagText = '';
  if (payoutsEnabled && paymentsEnabled) {
    tagText = 'Live';
  } else if (!payoutsEnabled || !paymentsEnabled) {
    tagText = 'Pending';
  }

  let awaitingStripeVerification = false;
  if (
    provider === PayoutsStrategy.Stripe &&
    (!payoutsEnabled || !paymentsEnabled) &&
    !stripeAccountLink &&
    sortCode
  ) {
    awaitingStripeVerification = true;
  }

  return (
    <SWrapper>
      <Text.SmallHeading mb="large">Card Payments</Text.SmallHeading>
      <Grid
        gridAutoFlow="column"
        alignItems="center"
        gridTemplateColumns="min-content"
      >
        {provider === PayoutsStrategy.Stripe ? <StripeLogo /> : <HMPayLogo />}
        <Tag tagStyle="blue" ml="8px">
          {tagText}
        </Tag>
      </Grid>
      <Grid
        gridAutoFlow="column"
        alignItems="center"
        justifyContent="start"
        gridGap={1}
        mt="medium"
      >
        <SIndicator bg={paymentsEnabled ? 'green' : 'red'} />
        <Text.Descriptor>
          Payments {paymentsEnabled ? 'Enabled' : 'Disabled'}
        </Text.Descriptor>
        <SIndicator bg={payoutsEnabled ? 'green' : 'red'} />
        <Text.Descriptor>
          Payouts {payoutsEnabled ? 'Enabled' : 'Disabled'}
        </Text.Descriptor>
      </Grid>
      {accountNumberLast4 ? (
        <>
          <Text.Descriptor mt="large">
            <Text.BoldDescriptor as="span">Account number </Text.BoldDescriptor>
            <Text.Descriptor as="span">
              ••••{accountNumberLast4}&nbsp;&nbsp;
            </Text.Descriptor>
            <Text.BoldDescriptor as="span">Sort code </Text.BoldDescriptor>
            <Text.Descriptor as="span">{sortCode}</Text.Descriptor>
          </Text.Descriptor>
          <Text.Descriptor mt="small">
            <Text.BoldDescriptor as="span">
              Payout schedule{' '}
            </Text.BoldDescriptor>
            <Text.Descriptor as="span">
              {payoutScheduleText} on a 7 day rolling basis
            </Text.Descriptor>
          </Text.Descriptor>
        </>
      ) : null}
      <Text.Descriptor my="large">
        Allow guests to pay with their card when ordering by adding it as a
        payment method.
      </Text.Descriptor>
      {awaitingStripeVerification ? (
        <Text.Descriptor>
          Awaiting Stripe Verification. You will be notified by email once
          we&apos;re ready for you to proceed to the next step.
        </Text.Descriptor>
      ) : (
        <Row>
          <Button preventDoubleClick buttonStyle="secondary" onClick={onClick}>
            {buttonText}
          </Button>
          {disableButtonText ? (
            <Button
              ml="16px"
              preventDoubleClick
              buttonStyle="delete"
              onClick={onDisable}
            >
              {disableButtonText}
            </Button>
          ) : null}
        </Row>
      )}
    </SWrapper>
  );
};
