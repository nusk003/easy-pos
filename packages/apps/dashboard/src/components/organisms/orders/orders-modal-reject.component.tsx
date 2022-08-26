import { Order, OrderStatus } from '@hm/sdk';
import { toast } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { Form } from '@src/components/templates';
import { sdk } from '@src/xhr/graphql-request';
import { useOrders } from '@src/xhr/query';
import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import styled from 'styled-components';

const SHeading = styled.div`
  font-size: 14px;
  color: #000;
`;

interface Props {
  order: Order;
  onClose: () => void;
  onBack: () => void;
}

interface FormValues {
  reasonRejected: string;
}

export const OrdersModalReject: React.FC<Props> = ({
  order,
  onClose,
  onBack,
}) => {
  const formMethods = useForm<FormValues>();

  const orderReference = order.orderReference?.toUpperCase();

  const { mutate: mutateOrders } = useOrders({}, false);

  const handleRejectOrder = async (formValues: FormValues) => {
    onClose();
    const toastId = toast.loader(`Rejecting Order #${orderReference}`);

    try {
      await sdk.updateOrder({
        data: {
          status: OrderStatus.Rejected,
          reasonRejected: formValues.reasonRejected,
        },
        where: { id: order.id },
      });
      toast.update(toastId, `Order #${orderReference} has been rejected`);
    } catch {
      toast.update(toastId, `Unable to reject Order #${orderReference}`);
    }

    await mutateOrders();
  };

  return (
    <Form.ModalWrapper>
      <FormContext {...formMethods}>
        <Form.Provider onSubmit={formMethods.handleSubmit(handleRejectOrder)}>
          <SHeading>Unable to process order</SHeading>
          <Inputs.Text
            name="reasonRejected"
            placeholder="Missing ingredients"
            label="Please briefly provide a reason"
          />
          <Form.Submit onCancel={onBack} buttonStyle="delete">
            Reject Order
          </Form.Submit>
        </Form.Provider>
      </FormContext>
    </Form.ModalWrapper>
  );
};
