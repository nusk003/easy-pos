import { Text } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import React from 'react';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';

type StyledProps = SpaceProps;

const SMenuWrapper = styled.div<StyledProps>`
  display: grid;
  grid-auto-flow: column;
  gap: 24px;
  justify-content: left;
  ${space}
`;

const SMenuItem = styled(Text.Body)`
  cursor: pointer;
`;

interface Props extends StyledProps {
  options: Array<string | undefined>;
  selected: string;
  onChange: (option: any) => void;
}

export const BookingsFilter: React.FC<Props> = ({
  options,
  selected,
  onChange,
  ...rest
}) => {
  return (
    <SMenuWrapper {...rest}>
      {options.filter(Boolean).map((option, index) => (
        <SMenuItem
          key={index}
          onClick={() => {
            onChange(option);
          }}
          color={
            selected === option ? theme.textColors.blue : theme.textColors.gray
          }
          fontWeight="semibold"
        >
          {option}
        </SMenuItem>
      ))}
    </SMenuWrapper>
  );
};
