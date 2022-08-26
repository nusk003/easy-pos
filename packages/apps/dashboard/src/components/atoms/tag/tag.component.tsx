import { theme } from '@src/components/theme';
import React from 'react';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';

type StyledProps = SpaceProps;

interface WrapperProps extends StyledProps {
  bgColor: string;
  textColor: string;
  fontWeight?: string;
  borderRadius?: number;
  borderColor?: string;
}

const SWrapper = styled.div<WrapperProps>`
  display: grid;
  align-items: center;
  width: max-content;
  background: ${(props): string => props.bgColor};
  color: ${(props): string => props.textColor};
  font-weight: ${(props): string | undefined => props.fontWeight || '600'};
  padding: 5px 10px;
  font-size: 11px;
  border-radius: ${(props): number => props.borderRadius || 100}px;
  border: 1px solid ${(props) => props.borderColor};
  user-select: none;
  text-transform: uppercase;
  height: fit-content;
  cursor: ${(props) => (props.onClick ? 'pointer' : 'unset')};
  ${space}
`;

export type TagStyle = 'gray' | 'red' | 'blue' | 'blue-border';

interface Props extends React.HTMLAttributes<HTMLDivElement>, StyledProps {
  children: React.ReactNode;
  tagStyle: TagStyle;
}

export const Tag: React.FC<Props> = ({ children, tagStyle, ...rest }) => {
  let bgColor;
  let textColor;
  let fontWeight;
  let borderRadius;
  let borderColor;

  switch (tagStyle) {
    case 'gray':
      bgColor = theme.colors.lightGray;
      textColor = theme.textColors.gray;
      borderColor = theme.colors.lightGray;
      break;

    case 'red':
      bgColor = theme.colors.lightRed;
      textColor = theme.textColors.red;
      borderColor = 'transparent';
      break;

    case 'blue':
      bgColor = theme.textColors.blue;
      textColor = theme.textColors.white;
      borderColor = 'transparent';
      break;

    case 'blue-border':
      bgColor = 'transparent';
      textColor = theme.textColors.blue;
      borderColor = theme.textColors.blue;
      break;

    default:
      bgColor = theme.colors.lightGray;
      textColor = theme.textColors.gray;
      break;
  }

  return (
    <SWrapper
      bgColor={bgColor}
      textColor={textColor}
      fontWeight={fontWeight}
      borderRadius={borderRadius}
      borderColor={borderColor}
      {...rest}
    >
      {children}
    </SWrapper>
  );
};
