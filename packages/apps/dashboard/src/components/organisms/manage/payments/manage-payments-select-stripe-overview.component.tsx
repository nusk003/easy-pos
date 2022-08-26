import { useHotel } from '@src/xhr/query';
import StripeLogoSrc from '@src/assets/payments/stripe-logo.png';
import { Button, Grid, Text, toast } from '@src/components/atoms';
import React, { useState } from 'react';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';
import { PayoutsStrategy } from '@hm/sdk';
import { sdk } from '@src/xhr/graphql-request';

const SLine = styled.div<SpaceProps>`
  width: 100%;
  height: 0.5px;
  background: #e8eaef;
  margin: 8px 0;
  ${space}
`;

const SWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${({ theme }): number => theme.space.medium}px;
  height: 540px;
`;

const StripeLogo = styled.img.attrs({
  src: StripeLogoSrc,
  alt: '',
})`
  justify-self: center;
  height: 40px;
`;

interface Props {
  onClick: () => void;
}

export const ManagePaymentsSelectStripeOverview: React.FC<Props> = ({
  onClick,
}) => {
  const { data: hotel, mutate: mutateHotel } = useHotel();

  const [submitLoading, setSubmitLoading] = useState(false);

  const stripeDisabled =
    hotel?.payouts?.enabled !== PayoutsStrategy.Stripe &&
    hotel?.payouts?.stripe;

  const handleClick = async () => {
    setSubmitLoading(true);
    try {
      if (stripeDisabled) {
        await sdk.enableHotelPayouts({
          payoutsStrategy: PayoutsStrategy.Stripe,
        });

        await mutateHotel();
      } else {
        onClick();
      }
    } catch {
      toast.info('Unable to process. Please try again later.');
    }
    setSubmitLoading(false);
  };

  return (
    <SWrapper>
      <Grid>
        <StripeLogo />
        <Text.BoldDescriptor mt="large">Transaction fee</Text.BoldDescriptor>
        <SLine />
        <Text.Secondary color="black">1.4% + 20p</Text.Secondary>
        <Text.Secondary>for European cards</Text.Secondary>
        <Text.Secondary mt="small" color="black">
          2.9% + 20p
        </Text.Secondary>
        <Text.Secondary>
          for non-European cards + currency conversion rate
        </Text.Secondary>
        <Text.BoldDescriptor mt="large">Payout fee</Text.BoldDescriptor>
        <SLine />
        <Text.Secondary color="black">£2</Text.Secondary>
        <Text.Secondary>per month</Text.Secondary>
        <Text.Secondary color="black" mt="small">
          £0.10
        </Text.Secondary>
        <Text.Secondary>per payout</Text.Secondary>
        <Text.Secondary color="black" mt="small">
          0.25%
        </Text.Secondary>
        <Text.Secondary>of payout volume</Text.Secondary>
      </Grid>
      <Grid>
        <Text.BoldDescriptor mt="large">Payout schedule</Text.BoldDescriptor>
        <SLine />
        <Text.Secondary color="black">Daily, weekly or monthly</Text.Secondary>
        <Text.Secondary>You choose your own payout schedule</Text.Secondary>
        <Button
          buttonStyle="primary"
          justifySelf="center"
          mb="small"
          mt="large"
          onClick={handleClick}
          loading={submitLoading}
        >
          {stripeDisabled ? 'Enable' : 'Set up'}
        </Button>
      </Grid>
    </SWrapper>
  );
};
