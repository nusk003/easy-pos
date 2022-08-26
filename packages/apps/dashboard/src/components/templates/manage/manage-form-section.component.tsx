import { Text } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import React from 'react';
import styled from 'styled-components';

const SWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: max-content;
  gap: 32px;

  ${theme.mediaQueries.tablet} {
    grid-template-columns: 1fr;
  }
`;

const SDetailsWrapper = styled.div``;

const SFormWrapper = styled.div`
  gap: 16px;
  display: grid;
  border-radius: 12px;
  padding: 24px;
  background: #fff;
  box-shadow: 0px 4px 16px rgba(18, 45, 115, 0.1);
`;

interface Props {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const ManageFormSection: React.FC<Props> = ({
  title,
  description,
  children,
}) => {
  return (
    <SWrapper>
      <SDetailsWrapper>
        <Text.Interactive>{title}</Text.Interactive>
        <Text.Body mt="4px">{description}</Text.Body>
      </SDetailsWrapper>
      <SFormWrapper>{children}</SFormWrapper>
    </SWrapper>
  );
};
