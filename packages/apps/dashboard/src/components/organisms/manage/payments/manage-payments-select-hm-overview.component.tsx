import { useHotel } from '@src/xhr/query';
import HMPayLogoSrc from '@src/assets/payments/hm-pay-logo.png';
import { Button, Grid, Text, toast } from '@src/components/atoms';
import React from 'react';
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

const HMPayLogo = styled.img.attrs({
  src: HMPayLogoSrc,
  alt: '',
})`
  justify-self: center;
  height: 40px;
`;

interface Props {
  onClick: () => void;
}

export const ManagePaymentsSelectHMOverview: React.FC<Props> = ({
  onClick,
}) => {
  const { data: hotel, mutate: mutateHotel } = useHotel();

  const hmPayDisabled =
    hotel?.payouts?.enabled !== PayoutsStrategy.HotelManagerPay &&
    hotel?.payouts?.hm;

  const handleClick = async () => {
    if (hmPayDisabled) {
      try {
        await sdk.enableHotelPayouts({
          payoutsStrategy: PayoutsStrategy.HotelManagerPay,
        });

        await mutateHotel();
        toast.info('Successfully enabled Hotel Manager Pay');
      } catch {
        toast.info('Unable to enable Hotel Manager Pay');
      }
    } else {
      onClick();
    }
  };

  return (
    <SWrapper>
      <Grid>
        <HMPayLogo />
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
        <Text.Secondary color="black">£5</Text.Secondary>
        <Text.Secondary>per payout</Text.Secondary>
      </Grid>
      <Grid>
        <Text.BoldDescriptor mt="large">Payout schedule</Text.BoldDescriptor>
        <SLine />
        <Text.Secondary color="black">On the 8th of each month</Text.Secondary>
        <Text.Secondary>Fixed</Text.Secondary>
        <Button
          buttonStyle="primary"
          justifySelf="center"
          mb="small"
          mt="large"
          onClick={handleClick}
        >
          {hmPayDisabled ? 'Enable' : 'Set up'}
        </Button>
      </Grid>
    </SWrapper>
  );
};
