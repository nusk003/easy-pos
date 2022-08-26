import StripeLogoSrc from '@src/assets/payments/stripe-logo.png';
import { Badge, Button, Text, toast } from '@src/components/atoms';
import { Modal } from '@src/components/molecules';
import { theme } from '@src/components/theme';
import { __root_address__, __stripe_client_id__ } from '@src/constants';
import { sdk } from '@src/xhr/graphql-request';
import { useHotel } from '@src/xhr/query';
import React, { useState } from 'react';
import styled from 'styled-components';

const SWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;

  margin: 0 10%;
  margin-top: 96px;

  ${({ theme }): string => theme.mediaQueries.tablet} {
    margin: 0 64px;
    margin-top: 96px;
    grid-template-columns: repeat(8, 1fr);
  }
`;

const SContentWrapper = styled.div`
  grid-column: 5 / 9;

  ${({ theme }): string => theme.mediaQueries.tablet} {
    grid-column: 5 / 9;
  }
`;

const StripeLogo = styled.img.attrs({
  src: StripeLogoSrc,
  alt: '',
})`
  justify-self: center;
  height: 40px;
`;

const SOptionWrapper = styled.div`
  margin-top: 36px;
`;

interface Props {
  onClose: () => void;
}

export const ManagePaymentsSelectStripe: React.FC<Props> = ({ onClose }) => {
  const { mutate: mutateHotel } = useHotel();

  const [submitLoading, setSubmitLoading] = useState(false);

  const handleCreateStripeAccount = async () => {
    setSubmitLoading(true);
    try {
      const { createStripeAccount } = await sdk.createStripeAccount();
      window.location.href = createStripeAccount.accountLink;

      await mutateHotel();
    } catch {
      toast.info('Unable to process. Please try again later.');
    }
    setSubmitLoading(false);
  };

  const handleLinkStripeAccount = () => {
    window.location.href = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${__stripe_client_id__}&scope=read_write&redirect_uri=${__root_address__}/manage/payments/stripe`;
  };

  return (
    <Modal visible onClose={onClose} fullScreen>
      <SWrapper>
        <SContentWrapper>
          <StripeLogo />
          <Text.Primary mt="16px" fontWeight="medium">
            There are two ways in which we can integrate card payments with
            Stripe.
          </Text.Primary>
          <SOptionWrapper>
            <Badge
              count={1}
              color={theme.textColors.white}
              backgroundColor={theme.colors.blue}
              mr="8px"
            />
            <Text.Body as="span" fontWeight="medium">
              Create a new account
            </Text.Body>
            <Text.Body mt="8px">
              If you don&apos;t have a Stripe account, you can set one up and
              manage it through your Dashboard without ever needing to go into
              Stripe.
            </Text.Body>
            <Text.Body mt="8px">
              You can manage your bank account details and payout preferences
              from your Dashboard once you create your account.
            </Text.Body>
            <Button
              buttonStyle="primary"
              mt="12px"
              loading={submitLoading}
              onClick={handleCreateStripeAccount}
            >
              Create a Stripe account →
            </Button>
          </SOptionWrapper>

          <SOptionWrapper>
            <Badge
              count={2}
              color={theme.textColors.white}
              backgroundColor={theme.colors.blue}
              mr="8px"
            />
            <Text.Body as="span" fontWeight="medium">
              Link an existing account
            </Text.Body>
            <Text.Body mt="8px">
              If you have an exisiting Stripe account, you can link it to Hotel
              Manager.
              <Text.Body mt="8px">
                If you want to manage your bank account details and payout
                preferences, you can do so from your Stripe dashboard as usual.
              </Text.Body>
            </Text.Body>
            <Button
              buttonStyle="primary"
              mt="12px"
              onClick={handleLinkStripeAccount}
            >
              Link your Stripe account →
            </Button>
          </SOptionWrapper>
        </SContentWrapper>
      </SWrapper>
    </Modal>
  );
};
