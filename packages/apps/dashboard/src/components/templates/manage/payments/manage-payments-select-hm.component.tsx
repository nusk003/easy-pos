import HMPayLogoSrc from '@src/assets/payments/hm-pay-logo.png';
import { Link, Text, toast } from '@src/components/atoms';
import { Inputs, Modal } from '@src/components/molecules';
import { Form } from '@src/components/templates';
import { validationResolver } from '@src/util/form';
import { sdk } from '@src/xhr/graphql-request';
import { useHotel, useUser } from '@src/xhr/query';
import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as z from 'zod';

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

const HMPayLogo = styled.img.attrs({
  src: HMPayLogoSrc,
  alt: '',
})`
  justify-self: center;
  height: 40px;
`;

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
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onClick: () => void;
  onClose: () => void;
}

export const ManagePaymentsSelectHM: React.FC<Props> = ({
  onClick,
  onClose,
}) => {
  const { data: user } = useUser();
  const { mutate: mutateHotel } = useHotel(false);

  const [state, setState] = useState({ view: 'form' });
  const [submitLoading, setSubmitLoading] = useState(false);

  const formMethods = useForm<FormValues>({
    validationContext: formSchema,
    validationResolver,
  });

  const handleSubmit = async (formValues: FormValues) => {
    if (state.view === 'form') {
      setState((s) => ({ ...s, view: 'verify' }));
      return;
    }

    setSubmitLoading(true);

    try {
      const { accountNumber } = formValues;
      const sortCode = formValues.sortCode.replace(/-/g, '');

      await sdk.createHMPayAccount({ accountNumber, sortCode });

      toast.info('Successfully added bank account details');

      await mutateHotel();
      onClick();
    } catch {
      toast.info('Unable to add bank account details. Please try again.');
    }

    setSubmitLoading(false);
  };

  return (
    <Modal visible onClose={onClose} fullScreen>
      <SWrapper>
        <SContentWrapper>
          <HMPayLogo />

          {state.view === 'form' ? (
            <Text.Primary my="huge">
              <p>
                We will send your payouts to this bank account on the 8th of
                each month.
              </p>
              <p>
                Payouts will include all payments from the 8th of the previous
                month until the 7th of the current month.
              </p>
              <p>
                A monthly payout confirmation will be sent to{' '}
                <strong>{user?.email}.</strong>
              </p>
            </Text.Primary>
          ) : (
            <Text.SuperHeading my="huge">Review & Confirm</Text.SuperHeading>
          )}
          <FormContext {...formMethods}>
            <Form.Provider onSubmit={formMethods.handleSubmit(handleSubmit)}>
              <Inputs.Text
                label="Sort code"
                name="sortCode"
                mask="99-99-99"
                disabled={state.view === 'verify'}
              />
              <Inputs.Text
                mask="99999999"
                label="Account number"
                name="accountNumber"
                disabled={state.view === 'verify'}
              />
              <Form.Submit
                loading={submitLoading}
                onCancel={onClose}
                cancelText="Back"
              >
                {state.view === 'form' ? 'Add bank account' : 'Activate'}
              </Form.Submit>
            </Form.Provider>
          </FormContext>
          <Link mt="huge" display="block">
            Learn more about payments
          </Link>
        </SContentWrapper>
      </SWrapper>
    </Modal>
  );
};
