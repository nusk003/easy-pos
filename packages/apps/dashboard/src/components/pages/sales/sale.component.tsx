import { Button, Grid, Text, toast } from '@src/components/atoms';
import { Header, PaymentsAddModal } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { format } from '@src/util/format';
import { sdk } from '@src/xhr/graphql-request';
import { useSale } from '@src/xhr/query';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

const SWrapper = styled.div`
  padding: 16px;
`;

const SProductsWrapper = styled.div`
  border: 1px solid ${theme.colors.lightGray};
  border-radius: 8px;
  padding: 16px;
  margin-top: 24px;
`;

interface SalesDetailProps {
  title: string;
  value: string;
}

const SalesDetail: React.FC<SalesDetailProps> = ({ title, value }) => {
  return (
    <Grid width="300px">
      <Text.Secondary>{title}:</Text.Secondary>
      <Text.Primary fontWeight="semibold">{value}</Text.Primary>
    </Grid>
  );
};

export const Sale: React.FC = () => {
  const saleId = useRouteMatch<{ id: string }>('/sale/:id')?.params?.id;
  const { data: sale, mutate } = useSale(saleId);

  const [visiblePaymentsModal, setVisiblePaymentsModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const salesReference = sale?.salesReference?.toUpperCase() || '';

  const customerName = sale?.customer.firstName + ' ' + sale?.customer.lastName;

  const onCancelSale = async () => {
    setCancelLoading(true);
    try {
      await sdk.updateSale({
        where: { id: sale?.id! },
        data: { cancelled: true, instalmentPlan: sale?.instalmentPlan },
      });
      await mutate();
    } catch {
      toast.warn('Unable to cancel');
    }
    setCancelLoading(false);
  };

  return (
    <>
      <PaymentsAddModal
        sale={sale as any}
        visible={visiblePaymentsModal}
        onClose={() => setVisiblePaymentsModal(false)}
      />
      <Header title={`Sale - ${salesReference}`} />
      <SWrapper>
        <Grid gridAutoFlow="column">
          <SalesDetail title="Sales Reference" value={salesReference} />
          <SalesDetail
            title="Total Amount"
            value={format.currency(sale?.totalPrice || '')}
          />
          <SalesDetail
            title="Initial Amount"
            value={format.currency(sale?.instalmentPlan.initialPayment || '')}
          />
          <SalesDetail
            title="No of terms"
            value={sale?.instalmentPlan.noTerms.toString() || ''}
          />
        </Grid>
        <Grid gridAutoFlow="column" mt="16px" alignItems="flex-start">
          <SalesDetail title="Name" value={customerName} />
          <SalesDetail title="NIC" value={sale?.customer.nic || ''} />
          <SalesDetail
            title="Phone"
            value={sale?.customer.phone || 'Not provided'}
          />
          <SalesDetail
            title="Address"
            value={sale?.customer.address || 'Not provided'}
          />
        </Grid>
        <SProductsWrapper>
          <Text.BoldDescriptor mb="24px" fontWeight="semibold">
            Products
          </Text.BoldDescriptor>
          {sale?.items.map((item) => (
            <Grid mt="8px" gridAutoFlow="column">
              <Text.BodyBold>x{item.quantity}</Text.BodyBold>
              <Text.Body>{item.title}</Text.Body>
              <Text.Body>{format.currency(item.totalCost)}</Text.Body>
              <Text.BodyBold>{format.currency(item.totalSell)}</Text.BodyBold>
            </Grid>
          ))}
        </SProductsWrapper>
        {!sale?.cancelled ? (
          <Grid
            mt="16px"
            gridAutoFlow="column"
            justifyContent="flex-end"
            alignItems="center"
            gridGap="8px"
          >
            <Button
              buttonStyle="delete"
              loading={cancelLoading}
              onClick={onCancelSale}
            >
              Cancel sale
            </Button>
            <Button
              buttonStyle="primary"
              onClick={() => setVisiblePaymentsModal(true)}
            >
              Create payment
            </Button>
          </Grid>
        ) : (
          <Text.BoldDescriptor mt="16px" color={theme.colors.red}>
            This sale is cancelled
          </Text.BoldDescriptor>
        )}

        <SProductsWrapper>
          <Text.BoldDescriptor mb="24px" fontWeight="semibold">
            Terms
          </Text.BoldDescriptor>
          {sale?.instalmentPlan.terms.map((term, index) => {
            const dueAmount = term.dueAmount;
            const paidAmount = term.paidAmount;
            const paidAmountColor =
              dueAmount === paidAmount
                ? theme.textColors.green
                : paidAmount > 0
                ? theme.textColors.orange
                : theme.textColors.gray;
            return (
              <Grid mt="8px" gridAutoFlow="column" alignItems="center">
                <Text.Body>Term {index + 1}</Text.Body>
                <div>
                  <Text.BodyBold>
                    {dayjs(term.dueDate).format('DD MMM YYYY')}
                  </Text.BodyBold>
                  <Text.Descriptor>Due date</Text.Descriptor>
                </div>
                <Text.Body>{format.currency(term.dueAmount)}</Text.Body>
                <Text.BodyBold color={paidAmountColor}>
                  {format.currency(term.paidAmount)}
                </Text.BodyBold>
              </Grid>
            );
          })}
        </SProductsWrapper>
      </SWrapper>
    </>
  );
};
