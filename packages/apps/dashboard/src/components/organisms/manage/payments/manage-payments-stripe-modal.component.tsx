import {
  HmPayAccountPayoutSchedule,
  PayoutInterval,
  StripeExternalAccountPayoutScheduleInput,
  StripeWeeklyPayoutInterval,
} from '@hm/sdk';
import StripeLogoSrc from '@src/assets/payments/stripe-logo.png';
import { Button, Grid, Link, Tag, Text, toast } from '@src/components/atoms';
import { Inputs, Modal } from '@src/components/molecules';
import { Form } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { validationResolver } from '@src/util/form';
import { sdk } from '@src/xhr/graphql-request';
import { useHotel, useUser } from '@src/xhr/query';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as z from 'zod';

const SButtonsWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: end;
  gap: 8px;
`;

const StripeLogo = styled.img.attrs({
  src: StripeLogoSrc,
  alt: '',
})`
  height: 40px;
`;

const digit = /[0-9]|•/;

const accountNumberMask = [
  digit,
  digit,
  digit,
  digit,
  digit,
  digit,
  digit,
  digit,
];

const weekdays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const getPayoutItems = (schedule: PayoutInterval) => {
  if (!schedule) {
    return [];
  }

  if (schedule === PayoutInterval.Weekly) {
    return weekdays;
  }
  if (schedule === PayoutInterval.Monthly) {
    return [...Array(28).keys()].map((idx) =>
      moment.localeData().ordinal(idx + 1)
    );
  }
  return [];
};

const formSchema = z.object({
  sortCode: z
    .string()
    .nonempty('Please enter your sort code')
    .refine((val) => val.length === 8, 'Please enter a valid sort code'),
  accountNumber: z
    .string()
    .nonempty('Please enter your account number')
    .refine(
      (val) => val.length === 8 || val.length === 7,
      'Please enter a valid account number'
    ),
  payoutInterval: z.string().nonempty('Please enter a payout interval'),
  payoutDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onClose: () => void;
  visible: boolean;
  accountNumberLast4?: string;
  sortCode: string | undefined;
  payoutsEnabled: boolean;
  paymentsEnabled: boolean;
  payoutSchedule?: HmPayAccountPayoutSchedule;
}

export const ManagePaymentsStripeModal: React.FC<Props> = ({
  onClose,
  visible,
  payoutsEnabled,
  paymentsEnabled,
  sortCode,
  accountNumberLast4,
  payoutSchedule,
}) => {
  const { data: user } = useUser();
  const { mutate: mutateHotel } = useHotel();

  const [state, setState] = useState<{
    view: 'edit' | 'display';
    payoutInterval?: PayoutInterval;
  }>({
    view: !payoutsEnabled ? 'edit' : 'display',
    payoutInterval: payoutSchedule?.interval,
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  let payoutDate;
  if (payoutSchedule?.interval === PayoutInterval.Monthly) {
    payoutDate = moment.localeData().ordinal(Number(payoutSchedule.date));
  } else if (payoutSchedule?.date) {
    payoutDate =
      payoutSchedule?.date[0].toLowerCase() + (payoutSchedule?.date).slice(1);
  }

  const formMethods = useForm<FormValues>({
    defaultValues: {
      sortCode,
      accountNumber: accountNumberLast4 ? `••••${accountNumberLast4}` : '',
      payoutInterval: payoutSchedule?.interval,
      payoutDate,
    },
    validationContext: formSchema,
    validationResolver,
  });

  let tagText = '';
  if (payoutsEnabled && paymentsEnabled) {
    tagText = 'Live';
  } else if (!payoutsEnabled || !paymentsEnabled) {
    tagText = 'Pending';
  }

  const handleSubmit = async () => {
    setSubmitLoading(true);

    if (state.view === 'display') {
      return;
    }

    const valid = await formMethods.triggerValidation();
    if (!valid) {
      return;
    }

    try {
      const formValues = formMethods.getValues();

      const { accountNumber } = formValues;

      const sortCode = formValues.sortCode.replace(/-/g, '');

      const payoutSchedule: StripeExternalAccountPayoutScheduleInput = {
        interval: formValues.payoutInterval.toLowerCase() as PayoutInterval,
      };

      if (formValues.payoutInterval === 'Daily') {
        payoutSchedule.interval = PayoutInterval.Daily;
      } else if (formValues.payoutInterval === 'Weekly') {
        payoutSchedule.interval = PayoutInterval.Weekly;
        payoutSchedule.weeklyInterval = _.capitalize(
          formValues.payoutDate
        ) as StripeWeeklyPayoutInterval;
      } else if (formValues.payoutInterval === 'Monthly') {
        payoutSchedule.interval = PayoutInterval.Monthly;
        payoutSchedule.monthlyInterval = Number(
          formValues.payoutDate?.replace(/[^0-9.]/g, '')
        );
      }

      await sdk.updateStripeExternalAccount({
        accountNumber,
        payoutSchedule,
        sortCode,
      });
      setState((s) => ({ ...s, view: 'display' }));
      toast.info('Successfully updated bank account details');
    } catch {
      toast.info('Unable to process request');
    }

    setSubmitLoading(false);
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

  const toggleEdit = () => {
    formMethods.setValue('sortCode', '');
    formMethods.setValue('accountNumber', '');
    setState((s) => ({ ...s, view: s.view === 'edit' ? 'display' : 'edit' }));
  };

  useEffect(() => {
    setTimeout(() => {
      setState((s) => ({ ...s, view: 'display' }));
    }, theme.modal.delay);
  }, [onClose]);

  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.persist();
    setState((s) => ({
      ...s,
      payoutInterval: _.capitalize(e?.target?.value) as PayoutInterval,
    }));
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <Form.ModalWrapper>
        <Grid gridAutoFlow="column" alignItems="center" justifyContent="start">
          <StripeLogo />
          <Tag tagStyle="blue">{tagText}</Tag>
        </Grid>
        <FormContext {...formMethods}>
          <Form.Provider onSubmit={formMethods.handleSubmit(handleSubmit)}>
            <Inputs.Text
              label="Sort code"
              name="sortCode"
              mask="99-99-99"
              disabled={state.view === 'display'}
            />
            <Inputs.Text
              mask={accountNumberMask}
              label="Account number"
              name="accountNumber"
              disabled={state.view === 'display'}
            />

            <Grid
              gridAutoFlow="column"
              justifyContent="start"
              alignItems="center"
              gridGap="small"
            >
              <Inputs.Select
                name="payoutInterval"
                items={['Daily', 'Weekly', 'Monthly']}
                onChange={handleOnChange}
                disabled={state.view === 'display'}
              />
              {state.payoutInterval &&
              state.payoutInterval !== PayoutInterval.Daily ? (
                <>
                  <Text.Body> on </Text.Body>
                  <Inputs.Select
                    name="payoutDate"
                    items={getPayoutItems(state.payoutInterval)}
                    capitalize
                    disabled={state.view === 'display'}
                  />
                </>
              ) : null}
            </Grid>
          </Form.Provider>
        </FormContext>
        <Button
          buttonStyle="primary"
          onClick={state.view === 'display' ? toggleEdit : handleSubmit}
          loading={submitLoading}
        >
          {state.view === 'display' ? 'Edit' : 'Update bank account'}{' '}
        </Button>
        <Text.Descriptor>
          A monthly payout confirmation will be sent to{' '}
          <Text.BoldDescriptor as="span">{user?.email}.</Text.BoldDescriptor>
        </Text.Descriptor>
        {/* TODO: Add UI <Link interactive>View payout details and fees</Link> */}
        <Link disableOnClick={false} interactive>
          Need help?
        </Link>
        <SButtonsWrapper>
          {payoutsEnabled ? (
            <Button buttonStyle="delete" onClick={handleDisablePayments}>
              Disable
            </Button>
          ) : null}

          <Button buttonStyle="secondary" onClick={onClose}>
            Close
          </Button>
        </SButtonsWrapper>
      </Form.ModalWrapper>
    </Modal>
  );
};
