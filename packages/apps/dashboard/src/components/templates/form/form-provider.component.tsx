import styled from 'styled-components';
import { flexbox, FlexboxProps, grid, GridProps } from 'styled-system';

type StyledProps = GridProps & FlexboxProps;

interface Props extends StyledProps {
  dense?: boolean;
}

export const Provider = styled.form<Props>`
  display: grid;
  grid-gap: ${(props): string => (props.dense ? '10px' : '20px')};
  align-content: baseline;

  ${grid}
  ${flexbox}
`;
