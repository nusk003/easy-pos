import { Text } from '@src/components/atoms';
import React from 'react';
import styled from 'styled-components';
import {
  space,
  SpaceProps,
  color as styledColor,
  ColorProps,
} from 'styled-system';

type StyledProps = SpaceProps & ColorProps;

const SWrapper = styled.div<StyledProps>`
  display: inline-grid;
  height: 20px;
  width: 20px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  ${space}
  ${styledColor}
`;

interface Props extends StyledProps, React.HTMLAttributes<HTMLDivElement> {
  count: number;
  color?: string;
}

export const Badge: React.FC<Props> = ({
  count,
  color = 'white',
  bg = 'altRed',
  ...rest
}) => {
  return (
    <SWrapper bg={bg} {...rest}>
      <Text.Interactive
        color={color}
        textAlign="center"
        fontSize={count < 99 ? 12 : 9}
      >
        {count < 99 ? count : '99+'}
      </Text.Interactive>
    </SWrapper>
  );
};
