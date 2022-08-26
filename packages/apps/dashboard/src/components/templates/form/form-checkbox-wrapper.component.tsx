import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';

export const CheckboxWrapper = styled.div<SpaceProps>`
  display: grid;
  grid-auto-flow: column;
  justify-content: flex-start;
  align-items: center;
  grid-gap: 8px;

  ${space}
`;
