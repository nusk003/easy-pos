import { theme } from '@src/components/theme';
import React from 'react';
import styled from 'styled-components';
import {
  border as styledBorder,
  BorderProps,
  color as styledColor,
  ColorProps,
  layout as styledLayout,
  LayoutProps,
  shadow as styledShadow,
  ShadowProps,
  space as styledSpace,
  SpaceProps,
} from 'styled-system';

type StyledProps = ColorProps &
  BorderProps &
  ShadowProps &
  SpaceProps &
  LayoutProps;

const SWrapper = styled.div<StyledProps>`
  display: grid;
  border-radius: 16px;
  align-content: baseline;
  height: fit-content;
  padding: 16px;
  border-width: 1px;
  border-style: solid;
  ${styledColor}
  ${styledBorder}
  ${styledShadow}
  ${styledSpace}
  ${styledLayout}
`;

type CardStyle = 'light-blue' | 'white-shadow';

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<StyledProps, 'color'> {
  children: React.ReactNode;
  cardStyle: CardStyle;
}

export const Card: React.FC<Props> = ({ children, cardStyle, ...rest }) => {
  let bg = '';
  let color = '';
  let borderColor = '';
  let boxShadow = '';

  switch (cardStyle) {
    case 'light-blue':
      bg = theme.colors.white;
      color = theme.textColors.gray;
      borderColor = theme.colors.lightBlue;
      break;

    case 'white-shadow':
      bg = theme.colors.white;
      color = theme.textColors.gray;
      borderColor = theme.colors.white;
      boxShadow = '0px 4px 16px rgba(18, 45, 115, 0.1)';
      break;

    default:
      break;
  }

  return (
    <SWrapper
      borderColor={borderColor}
      bg={bg}
      color={color}
      boxShadow={boxShadow}
      {...rest}
    >
      {children}
    </SWrapper>
  );
};
