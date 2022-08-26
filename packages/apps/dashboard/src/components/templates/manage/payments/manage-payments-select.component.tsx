import { Feature, Grid, Link, Text } from '@src/components/atoms';
import { Modal } from '@src/components/molecules';
import {
  ManagePaymentsSelectHMOverview,
  ManagePaymentsSelectStripeOverview,
} from '@src/components/organisms';
import { PaymentPageView } from '@src/components/pages/manage/manage-payments.component';
import { Flags, useFlags } from '@src/util/features';
import { useHotel } from '@src/xhr/query';
import React from 'react';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';

const SWrapper = styled.div`
  margin: 0;
  margin-top: 96px;

  ${({ theme }): string => theme.mediaQueries.tablet} {
    margin: 0 64px;
    margin-top: 96px;
  }
`;

interface SResponsiveGridProps {
  flags?: { [key in Flags]: boolean };
}

const SResponsiveGrid = styled.div<SpaceProps & SResponsiveGridProps>`
  display: ${(props): string =>
    !props?.flags?.stripeConnect || !props?.flags?.hmPay ? 'flex' : 'grid'};
  justify-content: center;
  grid-auto-flow: column;
  gap: 36px;

  ${space}
`;

const SHeading = styled.div`
  display: grid;
  justify-items: center;
  grid-column: 4 / 10;

  ${({ theme }): string => theme.mediaQueries.tablet} {
    grid-column: 1 / 9;
  }
`;

const SBox = styled(Grid)`
  box-shadow: 0px 4px 16px rgba(18, 45, 115, 0.1);
  border-radius: 12px;
  min-width: 360px;
`;

const SBoxHM = styled(SBox)``;

const SBoxStripe = styled(SBox)``;

interface Props {
  onClick: (view: PaymentPageView) => void;
  onClose: () => void;
}

export const ManagePaymentsSelect: React.FC<Props> = ({ onClick, onClose }) => {
  const flags = useFlags();

  const { data: hotel } = useHotel();

  return (
    <Modal visible onClose={onClose} fullScreen>
      <SWrapper>
        <SResponsiveGrid>
          <SHeading>
            <Text.SuperHeading mb="small">
              Choose your payments provider
            </Text.SuperHeading>
            <Text.Primary mb="small" textAlign="center">
              Please review the processing fees and select your preferred
              payments provider. You will need to provide your bank account
              information to receive payouts.
            </Text.Primary>
            <Link interactive>Learn more about Payments</Link>
          </SHeading>
        </SResponsiveGrid>

        <SResponsiveGrid mt={48} flags={flags}>
          {!hotel?.payouts?.stripe?.linked ? (
            <Feature name="hmPay">
              <SBoxHM>
                <ManagePaymentsSelectHMOverview
                  onClick={() => onClick(PaymentPageView.SelectHotelManagerPay)}
                />
              </SBoxHM>
            </Feature>
          ) : null}
          <SBoxStripe>
            <Feature name="stripeConnect">
              <ManagePaymentsSelectStripeOverview
                onClick={() => onClick(PaymentPageView.SelectStripe)}
              />
            </Feature>
          </SBoxStripe>
        </SResponsiveGrid>
      </SWrapper>
    </Modal>
  );
};
