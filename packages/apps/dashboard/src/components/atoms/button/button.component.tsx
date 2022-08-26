import { theme } from '@src/components/theme';
import { lighten } from 'polished';
import React, { forwardRef, useState } from 'react';
import styled from 'styled-components';
import {
  flexbox,
  FlexboxProps,
  grid,
  GridProps,
  space,
  SpaceProps,
} from 'styled-system';

type ButtonType = 'button' | 'submit' | 'reset' | undefined;

export type ButtonStyle = 'primary' | 'secondary' | 'tertiary' | 'delete';

type StyledProps = SpaceProps & GridProps & FlexboxProps;

interface WrapperProps extends StyledProps {
  textColor: string;
  disabledAppearance?: boolean;
  disabled?: boolean;
  bgColor: string;
  fontWeight: string;
  boxShadow: string;
  borderColor: string;
  type?: string;
  float?: string;
}

const SWrapper = styled.button<WrapperProps>`
  user-select: none;
  cursor: pointer;
  font-family: ${theme.fontFamily};
  display: grid;
  grid-auto-flow: column;
  gap: 8px;
  align-items: center;
  align-content: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.3s;
  height: 28px;
  width: max-content;
  min-width: 54px;
  color: ${(props): string => props.textColor};
  background: ${(props): string =>
    props.disabled || props.disabledAppearance
      ? lighten(theme.button.loadingOpacity, props.bgColor)
      : props.bgColor};
  text-align: center;
  padding: 0px 12px;
  border: 1px solid
    ${(props): string =>
      props.disabled || props.disabledAppearance
        ? lighten(theme.button.loadingOpacity, props.borderColor)
        : props.borderColor};
  font-size: 14px;
  line-height: 13px;
  font-weight: ${(props): string => props.fontWeight};
  box-shadow: ${(props): string => props.boxShadow};
  float: ${(props) => props.float};
  white-space: nowrap;

  :hover {
    background: ${(props): string | null =>
      props.disabled || props.disabledAppearance
        ? null
        : lighten(0.1, props.bgColor)};
    color: ${(props): string | null =>
      props.disabled || props.disabledAppearance ? null : props.textColor};
    border: ${(props): string | null =>
      props.disabled || props.disabledAppearance
        ? null
        : `1px solid ${lighten(0.1, props.borderColor)}`};
  }

  :focus {
    outline: none;
  }

  ${space};
  ${grid};
  ${flexbox};
`;

const SLeftIcon = styled.div``;

const SRightIcon = styled.div``;

interface Props extends React.HTMLAttributes<HTMLButtonElement>, StyledProps {
  buttonStyle: ButtonStyle;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  disabledAppearance?: boolean;
  children: React.ReactNode;
  preventDoubleClick?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: ButtonType;
  leftIcon?: React.ReactNode;
  stopPropagation?: boolean;
  float?: string;
}

const ButtonComponent: React.ForwardRefRenderFunction<
  HTMLButtonElement,
  Props
> = (
  {
    buttonStyle,
    loading,
    disabled,
    leftIcon,
    children,
    preventDoubleClick,
    onClick,
    rightIcon,
    stopPropagation,
    float,
    ...rest
  },
  ref
) => {
  const [preventClick, setPreventClick] = useState(false);

  let textColor = theme.textColors.white;
  let bgColor = theme.colors.blue;
  let borderColor = theme.colors.blue;

  let fontWeight = '600';
  let boxShadow = '';

  switch (buttonStyle) {
    case 'primary':
      textColor = theme.textColors.white;
      bgColor = theme.colors.blue;
      borderColor = theme.colors.blue;

      fontWeight = '600';
      boxShadow = '';
      break;

    case 'secondary':
      textColor = theme.textColors.gray;
      bgColor = theme.colors.white;
      borderColor = theme.colors.gray;

      fontWeight = '600';
      boxShadow = '0px 0.5px 2px rgba(86, 80, 104, 0.25)';
      break;

    case 'tertiary':
      textColor = theme.textColors.gray;
      bgColor = theme.colors.white;
      borderColor = theme.colors.gray;

      fontWeight = 'normal';
      boxShadow = '';
      break;

    case 'delete':
      textColor = theme.textColors.white;
      bgColor = theme.colors.red;
      borderColor = theme.colors.red;

      fontWeight = '600';
      boxShadow = '';
      break;

    default:
      break;
  }

  const handleOnClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (disabled) {
      return;
    }

    if (stopPropagation) {
      e.stopPropagation();
    }

    if (onClick) {
      if (!preventClick) {
        onClick(e);
        if (preventDoubleClick) {
          setPreventClick(true);
          setTimeout(() => {
            setPreventClick(false);
          }, 1000);
        }
      }
    }
  };

  return (
    <SWrapper
      ref={ref}
      disabled={loading || disabled}
      onClick={handleOnClick}
      textColor={textColor}
      bgColor={bgColor}
      borderColor={borderColor}
      fontWeight={fontWeight}
      boxShadow={boxShadow}
      float={float}
      {...rest}
    >
      {leftIcon ? <SLeftIcon>{leftIcon}</SLeftIcon> : null}
      <div>{children}</div>
      {rightIcon ? <SRightIcon>{rightIcon}</SRightIcon> : null}
    </SWrapper>
  );
};

export const Button = forwardRef(ButtonComponent);
