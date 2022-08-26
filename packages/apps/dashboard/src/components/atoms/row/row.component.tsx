import React from 'react';
import styled from 'styled-components';
import {
  alignItems,
  AlignItemsProps,
  border,
  BorderProps,
  color,
  ColorProps,
  justifyContent,
  JustifyContentProps,
  layout,
  LayoutProps,
  space,
  SpaceProps,
} from 'styled-system';

type StyledProps = SpaceProps &
  AlignItemsProps &
  JustifyContentProps &
  ColorProps &
  BorderProps &
  LayoutProps &
  React.HTMLAttributes<HTMLDivElement>;

interface Props extends StyledProps {
  children: React.ReactNode;
}

const SWrapper = styled.div<StyledProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${space};
  ${alignItems};
  ${justifyContent};
  ${color};
  ${border};
  ${layout}
`;

export const Row: React.FC<Props> = ({ children, ...rest }) => {
  return <SWrapper {...rest}>{children}</SWrapper>;
};
