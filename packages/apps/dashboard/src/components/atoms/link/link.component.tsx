import { theme } from '@src/components/theme';
import React, { useState } from 'react';
import styled, { css, FlattenSimpleInterpolation } from 'styled-components';
import {
  grid,
  GridProps,
  layout,
  LayoutProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from 'styled-system';

type StyledProps = SpaceProps & LayoutProps & TypographyProps & GridProps;

const interactiveStyle = css`
  font-size: 13px;
  line-height: 15px;
`;

const bodyStyle = css`
  font-size: 14px;
  line-height: 18px;
  color: ${theme.textColors.gray};
  font-weight: 600;
`;

interface WrapperProps {
  color: string;
  interactive?: boolean;
  body?: boolean;
}

const SWrapper = styled.a<WrapperProps>`
  cursor: pointer;
  user-select: none;
  display: grid;
  grid-gap: 8px;
  grid-auto-flow: column;
  align-self: center;
  align-items: center;
  color: ${(props): string => props.color};
  font-size: 12px;
  font-weight: 500;
  width: max-content;

  ${(props): FlattenSimpleInterpolation | null =>
    props.body ? bodyStyle : null};

  ${(props): FlattenSimpleInterpolation | null =>
    props.interactive ? interactiveStyle : null};

  ${space}
  ${layout}
  ${typography}
  ${grid}
`;

interface Props extends React.HTMLAttributes<HTMLAnchorElement>, StyledProps {
  disableOnClick?: boolean;
  linkStyle?: 'blue' | 'red' | 'black' | 'gray';
  interactive?: boolean;
  body?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
}

export const Link: React.FC<Props> = ({
  disableOnClick = true,
  onClick,
  children,
  linkStyle,
  interactive,
  body,
  icon,
  rightIcon,
  disabled = false,
  ...props
}) => {
  let { color } = props;
  switch (linkStyle) {
    case 'blue':
      color = theme.textColors.blue;
      break;

    case 'red':
      color = theme.textColors.red;
      break;

    case 'black':
      color = theme.textColors.gray;
      break;

    case 'gray':
      color = theme.textColors.lightGray;
      break;

    default:
      color = color || theme.textColors.blue;
      break;
  }

  const [state, setState] = useState({ disabled });

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (disableOnClick) {
      setState((s) => ({ ...s, disabled: true }));
    }
    if (!state.disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <SWrapper
      onClick={handleClick}
      color={color}
      interactive={interactive}
      body={body}
      {...props}
    >
      {icon}
      {children}
      {rightIcon ? rightIcon : null}
    </SWrapper>
  );
};
