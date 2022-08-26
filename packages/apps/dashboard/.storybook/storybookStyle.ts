import styled from 'styled-components';
import theme from '../src/components/theme';

export const StorybookWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-around;
  grid-gap: 8px;
  font-family: ${theme.fontFamily};
`;
