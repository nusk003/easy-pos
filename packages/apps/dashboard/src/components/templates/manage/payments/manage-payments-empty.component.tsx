import { Button, Text } from '@src/components/atoms';
import React from 'react';
import styled from 'styled-components';

const SBox = styled.div`
  padding: ${({ theme }): number => theme.space.medium}px;
  box-shadow: 0px 4px 16px rgba(18, 45, 115, 0.1);
  border-radius: 12px;
  max-width: 640px;
`;

interface Props {
  onClick: () => void;
}

export const ManagePaymentsEmpty: React.FC<Props> = ({ onClick }) => {
  return (
    <SBox>
      <Text.SmallHeading mb="4px">Card Payments</Text.SmallHeading>
      <Text.Descriptor mb="24px">
        You are currently not accepting card payments through your app. Activate
        card payments now with Hotel Manager Pay or Stripe.
      </Text.Descriptor>
      <Button onClick={onClick} buttonStyle="secondary">
        Activate
      </Button>
    </SBox>
  );
};
