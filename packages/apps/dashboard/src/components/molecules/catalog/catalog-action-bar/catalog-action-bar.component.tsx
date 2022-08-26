import { theme } from '@src/components/theme';
import React from 'react';
import styled from 'styled-components';

const SWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 16px;
  flex-direction: row;
  flex-wrap: wrap;

  position: sticky;
  top: 76.5px;
  background: ${theme.colors.white};
  padding: 16px 0;
  z-index: 1;

  ${theme.mediaQueries.tablet} {
    top: 61px;
  }
`;

interface Props {
  children: React.ReactNode;
}

export const CatalogActionBar: React.FC<Props> = ({ children }) => {
  return <SWrapper>{children}</SWrapper>;
};
