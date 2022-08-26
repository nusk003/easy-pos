import { Text } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

const capitalizeFirstLetter = (string: string): string => {
  return string[0].toUpperCase() + string.slice(1);
};

const SWrapper = styled.div`
  width: fit-content;
  user-select: none;
`;

const SLabelWrapper = styled.div`
  display: grid;
  grid-gap: 4px;
  margin-bottom: 16px;
`;

<svg
  width="8"
  height="6"
  viewBox="0 0 8 6"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M7.06 0.726669L4 3.78L0.94 0.726669L0 1.66667L4 5.66667L8 1.66667L7.06 0.726669Z"
    fill="#333742"
  />
</svg>;

const SSelect = styled.select`
  font-family: ${theme.fontFamily};
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg width='8' height='6' viewBox='0 0 8 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.06 0.726669L4 3.78L0.94 0.726669L0 1.66667L4 5.66667L8 1.66667L7.06 0.726669Z' fill='%23333742'/%3E%3C/svg%3E%0A"),
    linear-gradient(
      to bottom,
      ${theme.colors.offWhite} 0%,
      ${theme.colors.offWhite} 100%
    );
  background-repeat: no-repeat, repeat;
  background-position: right 12px top 50%, 0 0;
  background-size: 0.65em 100%, 100%;
  border-radius: 8px;
  font-weight: ${theme.fontWeights.semibold};

  border: none;
  appearance: none;
  color: ${theme.textColors.gray};
  padding: 10px 12px;
  padding-right: 36px;

  :focus {
    border-color: none;
    box-shadow: none;
    outline: none;
  }

  :hover {
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg width='8' height='6' viewBox='0 0 8 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.06 0.726669L4 3.78L0.94 0.726669L0 1.66667L4 5.66667L8 1.66667L7.06 0.726669Z' fill='%23333742'/%3E%3C/svg%3E%0A"),
      linear-gradient(
        to bottom,
        ${theme.colors.lightGray} 0%,
        ${theme.colors.lightGray} 100%
      );
  }
`;

const SOption = styled.option`
  font-family: ${theme.fontFamily};
`;

type OptionProps = {
  label: string;
  value: string | number | boolean;
};

interface Props extends React.HTMLAttributes<HTMLSelectElement> {
  name: string;
  items: Array<string | number> | Array<OptionProps>;
  label?: string;
  capitalize?: boolean;
  disabled?: boolean;
  note?: string;
}

export const Select: React.FC<Props> = ({
  name,
  items,
  label,
  note,
  capitalize,
  ...rest
}) => {
  const { register } = useFormContext();

  return (
    <SWrapper>
      {label ? (
        <SLabelWrapper>
          {label ? <Text.Body fontWeight="medium">{label}</Text.Body> : null}
          {note ? <Text.Descriptor>{note}</Text.Descriptor> : null}
        </SLabelWrapper>
      ) : null}
      <SSelect
        name={name}
        ref={(e: HTMLSelectElement) => {
          register(e);
        }}
        {...rest}
      >
        {items.map((item: string | number | OptionProps) => {
          let option: OptionProps = {
            label: '',
            value: '',
          };

          if (typeof item === 'object') {
            option = item;
          } else {
            option.label = String(item);
            option.value = item;
          }

          return (
            <SOption key={String(option.value)} value={String(option.value)}>
              {capitalize ? capitalizeFirstLetter(option.label) : option.label}
            </SOption>
          );
        })}
      </SSelect>
    </SWrapper>
  );
};
