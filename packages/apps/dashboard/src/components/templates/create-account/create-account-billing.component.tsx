import { RegisterGroupAdminMutationVariables } from '@hm/sdk';
import { Button, Text, toast } from '@src/components/atoms';
import {
  CreateAccountForm,
  CreateAccountPricingCard,
  CreateAccountFormSection,
} from '@src/components/organisms';
import { theme } from '@src/components/theme';
import { useStore } from '@src/store';
import { sdk } from '@src/xhr/graphql-request';
import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const SCreateAccountForm = styled(CreateAccountForm)`
  width: 672px;
`;

const SDescription = styled(Text.Primary)`
  color: ${theme.textColors.lightGray};
  font-size: 14px;
`;

const SPricingWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 40px;
  width: max-content;
`;

const SPricingOptionWrapper = styled.div`
  display: grid;
  grid-gap: 16px;
`;

const SPricingTitle = styled(Text.Primary)`
  font-weight: 600;
  font-size: 14px;
`;

const SCurrentWrapper = styled.div`
  border: 2px solid #3c88eb;
  background: ${theme.colors.white};
  padding: 8px 16px;
  border-radius: 16px;
  text-align: center;
  color: #3c88eb;
  font-weight: 600;
  font-size: 14px;
`;

const SLaunchSoonWrapper = styled.div`
  background: #3c88eb;
  opacity: 0.5;
  padding: 8px 16px;
  border: 2px solid #3c88eb;
  border-radius: 16px;
  justify-content: center;
  color: ${theme.textColors.white};
  font-weight: 600;
  font-size: 14px;
`;

const SFinishButtonWrapper = styled.div`
  display: grid;
  justify-content: end;
`;

const earlyFeatures = [
  'Try it as much as you want',
  'Set up and configure fully',
  'Go live with your hotel’s app',
  'Fully branded',
  'Friendly support',
];

const standardFeatures = [
  'Start billing cycle when app is live',
  'Go live with your hotel’s app',
  'All core features',
  'Fully branded',
  'Friendly support',
];

export const CreateAccountBilling: React.FC = () => {
  const history = useHistory();

  const {
    createAccount: createAccountState,
    setHotelId,
    setLoggedIn,
  } = useStore(
    useCallback(
      (state) => ({
        createAccount: state.createAccount,
        setHotelId: state.setHotelId,
        setLoggedIn: state.setLoggedIn,
      }),
      []
    )
  );

  const handleSubmit = async () => {
    try {
      const { registerGroupAdmin } = await sdk.registerGroupAdmin(
        createAccountState as RegisterGroupAdminMutationVariables
      );
      setLoggedIn(true);
      setHotelId(registerGroupAdmin.hotel.id);
      history.push('/');
    } catch {
      toast.warn('Unable to create your account. Please try again later.');
    }
  };

  useEffect(() => {
    if (!createAccountState?.user?.firstName) {
      history.push('/create-account/user');
    } else if (!createAccountState?.hotel?.name) {
      history.push('/create-account/hotel');
    }
  }, [createAccountState, history]);

  return (
    <SCreateAccountForm title="Your early access">
      <CreateAccountFormSection>
        <SDescription>
          As an early partner, we’re giving you{' '}
          <b>complimentary access until we launch</b> later this year. Try our
          platform as much as you want until then and launch your app as soon as
          you’re ready — for free.
        </SDescription>
      </CreateAccountFormSection>
      <CreateAccountFormSection
        title="Subscription plan"
        description="Simple, straightforward pricing. Absolutely no hidden fees."
      >
        <SPricingWrapper>
          <SPricingOptionWrapper>
            <SPricingTitle>Now</SPricingTitle>
            <CreateAccountPricingCard
              heading="early access"
              price="Free"
              features={earlyFeatures}
              details="No credit card required"
            >
              <SCurrentWrapper>Current plan</SCurrentWrapper>
            </CreateAccountPricingCard>
          </SPricingOptionWrapper>
          <SPricingOptionWrapper>
            <SPricingTitle>Hotel Manager launch</SPricingTitle>
            <CreateAccountPricingCard
              heading="standard"
              price="£4.50"
              priceNotes="/ room / month"
              features={standardFeatures}
              details="We'll keep you in the loop"
            >
              <SLaunchSoonWrapper>Launching soon</SLaunchSoonWrapper>
            </CreateAccountPricingCard>
          </SPricingOptionWrapper>
        </SPricingWrapper>
      </CreateAccountFormSection>
      <CreateAccountFormSection>
        <SDescription>
          We’ll give you plenty of notice before we publicly launch so you can
          prepare. If you do <b>not</b> wish to continue with our subscription
          plan at that point, we’ll be sad to see you go but happy to assist
          with your account’s cancellation and offboarding (we’ve made this part
          easy too).
        </SDescription>
      </CreateAccountFormSection>
      <SFinishButtonWrapper>
        <Button buttonStyle="primary" onClick={handleSubmit}>
          Finish sign-up
        </Button>
      </SFinishButtonWrapper>
    </SCreateAccountForm>
  );
};
