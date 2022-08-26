import { theme } from '@src/components/theme';
import { lighten } from 'polished';
import React from 'react';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';

interface WrapperProps {
  background?: string;
  width: number;
  color: string;
}

const SWrapper = styled.div<WrapperProps>`
  display: grid;
  background: ${(props): string =>
    props.background || lighten(0.3, props.color) || theme.colors.lightBlue};
  width: ${(props): number => props.width}px;
  height: ${(props): number => props.width}px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  margin-right: 16px;

  ${space}
`;

interface MiddleBackgroundWrapperProps {
  middleBackground?: string;
}

const MiddleBackgroundWrapper = styled.div<MiddleBackgroundWrapperProps>`
  width: 16px;
  height: 16px;
  background: ${(props): string => props.middleBackground || 'transparent'};
  padding: 2px;
  border-radius: 50%;
  display: grid;
  align-content: center;
  justify-content: center;
`;

interface InnerWrapperProps {
  background?: string;
  color?: string;
}

const InnerWrapper = styled.div<InnerWrapperProps>`
  display: grid;
  background: ${(props): string => props.background || 'transparent'};
  align-items: center;
  justify-items: center;
  color: ${(props): string => props.color || theme.colors.blue};
  box-sizing: content-box;
`;

type StyleProps = SpaceProps;

interface Props extends StyleProps {
  icon: React.FC<any>;
  innerWidth?: number;
  color: string;
  width?: number;
  middleBackground?: string;
  background?: string;
}

export const CircleIcon: React.FC<Props> = ({
  icon: Icon,
  innerWidth,
  background,
  color,
  width = 44,
  middleBackground,
  ...rest
}) => {
  const iconWidth = innerWidth || 16;

  return (
    <SWrapper {...rest} background={background} color={color} width={width}>
      <InnerWrapper color={color}>
        <MiddleBackgroundWrapper middleBackground={middleBackground}>
          <Icon style={{ width: iconWidth, height: iconWidth }} />
        </MiddleBackgroundWrapper>
      </InnerWrapper>
    </SWrapper>
  );
};
