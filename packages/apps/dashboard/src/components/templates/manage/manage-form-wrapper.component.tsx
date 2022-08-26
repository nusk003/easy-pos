import { theme } from '@src/components/theme';
import styled from 'styled-components';

export const ManageFormWrapper = styled.div`
  min-height: calc(100vh - 141px);
  margin-right: -16px;

  display: grid;
  gap: 24px;
  align-content: start;

  background: #fafafa;
  padding: 32px;

  ${theme.mediaQueries.tablet} {
    padding: 16px;
    min-height: calc(100vh - 101px);
  }
`;
