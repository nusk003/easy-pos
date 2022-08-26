import { useHotel, useUser } from '@src/xhr/query';
import HMPayLogoSrc from '@src/assets/payments/hm-pay-logo.png';
import { Button, Grid, Link, Tag, Text, toast } from '@src/components/atoms';
import { Inputs, Modal } from '@src/components/molecules';
import { Form } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { validationResolver } from '@src/util/form';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as z from 'zod';
import {
  HmPayAccountPayoutSchedule,
  HmPayAccountPayoutScheduleInput,
  PayoutInterval,
} from '@hm/sdk';
import { sdk } from '@src/xhr/graphql-request';
import {
  parsePayoutInterval,
  ReadablePayoutInterval,
} from '@src/util/payments';

const SButtonsWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: end;
  gap: 8px;
`;

const StripeLogo = styled.img.attrs({
  src: HMPayLogoSrc,
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

const getPayoutItems = (schedule: PayoutInterval): Array<string> => {
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

interface Props {
  onClose: () => void;
  visible: boolean;
  accountNumberLast4?: string;
  sortCode: string;
  payoutsEnabled: boolean;
  paymentsEnabled: boolean;
  payoutSchedule?: HmPayAccountPayoutSchedule;
}

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
interface FormValues extends z.infer<typeof formSchema> {
  payoutInterval: ReadablePayoutInterval;
}

export const ManagePaymentsHMModal: React.FC<Props> = ({
  onClose,
  visible,
  payoutsEnabled,
  paymentsEnabled,
  sortCode,
  accountNumberLast4,
}) => {
  const { data: user } = useUser();
  const { mutate: mutateHotel } = useHotel(false);

  const [state, setState] = useState<{
    view: 'edit' | 'display';
    payoutInterval: PayoutInterval;
  }>({
    view: !payoutsEnabled ? 'edit' : 'display',
    payoutInterval: PayoutInterval.Monthly,
  });

  const formMethods = useForm<FormValues>({
    defaultValues: {
      sortCode,
      accountNumber: accountNumberLast4 ? `••••${accountNumberLast4}` : '',
      payoutInterval: 'monthly',
      payoutDate: moment.localeData().ordinal(8),
    },
    validationContext: formSchema,
    validationResolver,
  });

  const tagText = useMemo(() => {
    if (payoutsEnabled && paymentsEnabled) {
      return 'Live';
    } else if (!payoutsEnabled || !paymentsEnabled) {
      return 'Pending';
    }

    return '';
  }, [paymentsEnabled, payoutsEnabled]);

  const handleSubmit = async () => {
    if (state.view === 'display') {
      return;
    }

    const valid = await formMethods.triggerValidation();
    if (!valid) {
      return;
    }

    const formValues = formMethods.getValues();

    const sortCode = formValues.sortCode.replace(/-/g, '');

    const payoutSchedule: HmPayAccountPayoutScheduleInput = {
      interval: parsePayoutInterval(formValues.payoutInterval),
      date: formValues.payoutDate!.replace(/[^0-9.]/g, ''),
    };

    const accountNumber = formValues.accountNumber;

    try {
      await sdk.updateHMPayExternalAccount({
        accountNumber,
        payoutSchedule,
        sortCode,
      });

      await mutateHotel();

      setState((s) => ({ ...s, view: 'display' }));
      toast.info('Successfully updated bank account details');
    } catch {
      toast.info('Unable to process request');
    }
  };

  const handleDisablePayments = async () => {
    try {
      await sdk.disableHotelPayouts();
      await mutateHotel();
      onClose();
      toast.info('Successfully disabled payments');
    } catch {
      toast.info('Unable to process request');
    }
  };

  const toggleEdit = () => {
    setState((s) => ({ ...s, view: s.view === 'edit' ? 'display' : 'edit' }));
    formMethods.setValue('sortCode', '');
    formMethods.setValue('accountNumber', '');
  };

  useEffect(() => {
    if (!visible) {
      setTimeout(() => {
        setState((s) => ({ ...s, view: 'display' }));
      }, theme.modal.delay);
    }
  }, [onClose, visible]);

  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.persist();
    setState((s) => ({
      ...s,
      payoutInterval: e?.target?.value as PayoutInterval,
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
              mask={state.view === 'display' ? accountNumberMask : '99999999'}
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
                items={['daily', 'weekly', 'monthly']}
                capitalize
                onChange={handleOnChange}
                disabled
              />
              {state.payoutInterval !== PayoutInterval.Daily ? (
                <>
                  <Text.Body> on </Text.Body>
                  <Inputs.Select
                    name="payoutDate"
                    items={getPayoutItems(state.payoutInterval)}
                    capitalize
                    disabled
                  />
                </>
              ) : null}
              <Text.Notes>Fixed payout with Hotel Manager Pay</Text.Notes>
            </Grid>
          </Form.Provider>
        </FormContext>
        <Button
          buttonStyle="primary"
          onClick={state.view === 'display' ? toggleEdit : handleSubmit}
        >
          {state.view === 'display' ? 'Edit' : 'Update bank account'}
        </Button>
        <Text.Descriptor>
          A monthly payout confirmation will be sent to{' '}
          <Text.BoldDescriptor as="span">{user?.email}.</Text.BoldDescriptor>
        </Text.Descriptor>
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
