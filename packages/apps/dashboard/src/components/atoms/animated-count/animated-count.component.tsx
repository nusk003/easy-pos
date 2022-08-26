import { theme } from '@src/components/theme';
import React from 'react';
import styled from 'styled-components';
import { Text } from '@src/components/atoms/text';

interface CounterProps {
  count: number;
  name: string;
}

const SWrapper = styled(Text.Heading)<CounterProps>`
  @property --${({ name }) => name} {
    syntax: '<integer>';
    initial-value: ${({ count }) => count};
    inherits: false;
  }
  animation-name: ${({ name }) => name}-animation;
  animation-duration: 3s;
  counter-reset: ${({ name }) => name} var(--${({ name }) => name});

  ::after {
    content: counter(${({ name }) => name});
  }

  @keyframes ${({ name }) => name}-animation {
    from {
      --${({ name }) => name}: 0;
    }
    
    to {
      --${({ name }) => name}: ${({ count }) => count};
    }
  }
`;

interface Props {
  count: number;
  name: string;
}

export const AnimatedCount: React.FC<Props> = ({ count, name }) => {
  return (
    <SWrapper
      count={count}
      name={`animated-count-${name}`}
      color={theme.textColors.blue}
    />
  );
};
