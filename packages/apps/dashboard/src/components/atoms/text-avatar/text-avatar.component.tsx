import React from 'react';
import styled from 'styled-components';
import {
  background,
  BackgroundProps,
  color,
  ColorProps,
  grid,
  GridProps,
  space,
  SpaceProps,
} from 'styled-system';

interface WrapperProps extends StyledProps {
  size: number;
  clickable: boolean;
}

type StyledProps = ColorProps & SpaceProps & BackgroundProps & GridProps;

const SWrapper = styled.div<WrapperProps>`
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: ${(props) => (props.clickable ? 'pointer' : undefined)};
  font-weight: ${(props): string => props.theme.fontWeights.semibold};

  width: ${(props): string => `${props.size}px`};
  height: ${(props): string => `${props.size}px`};

  ${color}
  ${space}
  ${background}
  ${grid}
`;

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<StyledProps, 'color'> {
  size?: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
  text?: string;
  clickable?: boolean;
}

export const TextAvatar: React.FC<Props> = ({
  size = 12,
  children,
  text,
  clickable = false,
  ...rest
}) => {
  return (
    <SWrapper clickable={clickable} size={size} {...rest}>
      {text}
      {children}
    </SWrapper>
  );
};
