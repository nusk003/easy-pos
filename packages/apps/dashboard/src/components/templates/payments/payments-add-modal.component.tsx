import { Button, Grid, Text, toast } from '@src/components/atoms';
import { Inputs, Modal } from '@src/components/molecules';
import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { Form } from '../form';
import * as z from 'zod';
import { validationResolver } from '@src/util/form';
import { Sale } from '@hm/sdk';
import { sdk } from '@src/xhr/graphql-request';

interface Props {
  visible: boolean;
  onClose: () => void;
  sale?: Sale | undefined;
}

const SWrapper = styled.div`
  padding: 16px;
  width: 530px;
`;

const formSchema = z.object({
  amount: z
    .string()
    .nonempty('Amount must be provided')
    .or(z.number())
    .transform((val) => {
      if (typeof val === 'string') {
        return parseFloat(val);
      }
      return val;
    }),
});

type FormValues = z.infer<typeof formSchema>;

export const PaymentsAddModal: React.FC<Props> = ({
  visible,
  onClose,
  sale,
}) => {
  const formMethods = useForm<FormValues>({
    validationContext: formSchema,
    validationResolver: validationResolver,
  });

  const onSubmit = async (formValues: FormValues) => {
    let amount = formValues.amount;
    sale?.instalmentPlan?.terms?.forEach((term) => {
      if (amount > 0) {
        const allowedAmount = term.dueAmount - term.paidAmount;
        if (allowedAmount <= amount) {
          term.paidAmount += allowedAmount;
          amount -= allowedAmount;
        } else {
          term.paidAmount += amount;
          amount = 0;
        }
      }
      return;
    });

    const toastId = toast.loader('Creating payment...');

    try {
      await sdk.updateSale({
        where: { id: sale?.id! },
        data: { instalmentPlan: sale?.instalmentPlan },
      });
      toast.update(toastId, 'Payment successfully created');
      formMethods.reset();
    } catch (error) {
      toast.update(toastId, 'Unable to create payment');
    }
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <SWrapper>
        <Text.Heading fontWeight="semibold" mb="24px">
          Add payment
        </Text.Heading>
        <FormContext {...formMethods}>
          <Form.Provider onSubmit={formMethods.handleSubmit(onSubmit)}>
            <Inputs.Text name="amount" label="Amount" placeholder="Amount" />
            <Grid gridAutoFlow="column" justifyContent="flex-end">
              <Button buttonStyle="primary">Create payment</Button>
            </Grid>
          </Form.Provider>
        </FormContext>
      </SWrapper>
    </Modal>
  );
};
