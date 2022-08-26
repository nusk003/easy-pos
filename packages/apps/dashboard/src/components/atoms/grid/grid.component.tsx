import styled from 'styled-components';
import {
  flexbox,
  FlexboxProps,
  grid,
  GridProps,
  layout,
  LayoutProps,
  space,
  SpaceProps,
  border,
  BorderProps,
} from 'styled-system';

type Props = SpaceProps & GridProps & LayoutProps & FlexboxProps & BorderProps;

export const Grid = styled.div<Props>`
  display: grid;
  ${space}
  ${grid}
  ${layout}
  ${flexbox}
  ${border}
`;
