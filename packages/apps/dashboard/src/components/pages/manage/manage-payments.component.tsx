import { PayoutsStrategy } from '@hm/sdk';
import {
  Header,
  ManagePaymentsEmpty,
  ManagePaymentsHM,
  ManagePaymentsSelect,
  ManagePaymentsSelectHM,
  ManagePaymentsSelectStripe,
  ManagePaymentsStripe,
} from '@src/components/templates';
import { theme } from '@src/components/theme';
import { sdk } from '@src/xhr/graphql-request';
import { useHotel } from '@src/xhr/query';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

export enum PaymentPageView {
  Empty,
  HotelManagerPay,
  Stripe,
  Select,
  SelectStripe,
  SelectHotelManagerPay,
}

const SWrapper = styled.div`
  height: calc(100vh - 141px);
  margin-right: -16px;

  display: grid;
  align-content: start;
  gap: 16px;

  background: #fafafa;
  padding: 32px;
  padding-right: 30%;

  ${theme.mediaQueries.tablet} {
    padding: 16px;
  }
`;

export const ManagePayments = () => {
  const { data: hotel, mutate: mutateHotel } = useHotel();

  const history = useHistory();

  const enabledProvider = hotel?.payouts?.enabled;

  const [state, setState] = useState({ view: PaymentPageView.Empty });

  useEffect(() => {
    if (enabledProvider === PayoutsStrategy.Stripe) {
      setState((s) => ({ ...s, view: PaymentPageView.Stripe }));
    }
    if (enabledProvider === PayoutsStrategy.HotelManagerPay) {
      setState((s) => ({ ...s, view: PaymentPageView.HotelManagerPay }));
    }
  }, [enabledProvider]);

  const payoutsDisabled = hotel?.payouts?.enabled === PayoutsStrategy.Disabled;
  useEffect(() => {
    if (payoutsDisabled) {
      setState((s) => ({ ...s, view: PaymentPageView.Empty }));
    }
  }, [payoutsDisabled]);

  const handleLinkStripeAccount = useCallback(
    async (stripeAuthCode: string) => {
      await sdk.linkStripeAccount({ authCode: stripeAuthCode });
      await mutateHotel();
    },
    [mutateHotel]
  );

  useEffect(() => {
    if (history.location.pathname.includes('/manage/payments/stripe')) {
      const searchParams = new URLSearchParams(location.search);

      const stripeAuthCode = searchParams.get('code');

      history.push('/manage/payments');

      if (stripeAuthCode) {
        handleLinkStripeAccount(stripeAuthCode);
      }
    }
  }, [handleLinkStripeAccount, history]);

  const RenderedComponent = useMemo(() => {
    if (state.view === PaymentPageView.SelectHotelManagerPay) {
      return (
        <ManagePaymentsSelectHM
          onClick={() =>
            setState((s) => ({
              ...s,
              view: PaymentPageView.HotelManagerPay,
            }))
          }
          onClose={() =>
            setState((s) => ({ ...s, view: PaymentPageView.Select }))
          }
        />
      );
    }

    if (state.view === PaymentPageView.SelectStripe) {
      return (
        <ManagePaymentsSelectStripe
          onClose={() =>
            setState((s) => ({ ...s, view: PaymentPageView.Select }))
          }
        />
      );
    }

    if (state.view === PaymentPageView.Select) {
      return (
        <ManagePaymentsSelect
          onClick={(view) => setState((s) => ({ ...s, view }))}
          onClose={() =>
            setState((s) => ({ ...s, view: PaymentPageView.Empty }))
          }
        />
      );
    }

    if (state.view === PaymentPageView.Empty) {
      return (
        <ManagePaymentsEmpty
          onClick={() =>
            setState((s) => ({ ...s, view: PaymentPageView.Select }))
          }
        />
      );
    }

    if (state.view === PaymentPageView.HotelManagerPay) {
      return <ManagePaymentsHM />;
    }

    if (state.view === PaymentPageView.Stripe) {
      return <ManagePaymentsStripe />;
    }
  }, [state.view]);

  return (
    <>
      <Header backgroundColor="#fafafa" title="Payments" />
      <SWrapper>{RenderedComponent}</SWrapper>
    </>
  );
};
