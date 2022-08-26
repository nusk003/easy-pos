import { Text } from '@src/components/atoms';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';
import { ErrorText } from './text.component';

type StyledWrapperProps = SpaceProps;

const SWrapper = styled.div<StyledWrapperProps>`
  ${space}
`;

const SInputsWrapper = styled.div`
  display: grid;
  gap: 8px;
`;

const SInput = styled.input`
  appearance: none;
  margin: 0;

  font: inherit;
  color: #3c88eb;
  width: 20px;
  height: 20px;
  border: 2px solid #3c88eb;
  border-radius: 50%;
  transform: translateY(-0.075em);

  display: grid;
  place-content: center;

  ::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em #3c88eb;
  }

  :checked::before {
    transform: scale(1);
  }
`;

const SInputWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 8px;
  grid-template-columns: min-content;
  align-items: start;
`;

const SLabel = styled(Text.Body)`
  user-select: none;
`;

interface Props
  extends React.InputHTMLAttributes<HTMLInputElement>,
    StyledWrapperProps {
  label?: string;
  name: string;
  data: Array<string> | string;
  showRadioLabel?: boolean;
  displayError?: boolean;
  sideLabel?: string;
  disabled?: boolean;
}

export const Radio: React.FC<Props> = ({
  name,
  data,
  showRadioLabel = true,
  defaultValue,
  displayError = true,
  sideLabel,
  mt,
  mb,
  ml,
  mr,
  ...rest
}) => {
  const { register, errors } = useFormContext();

  if (typeof data === 'string') {
    data = [data];
  }

  return (
    <SWrapper mt={mt} mb={mb} mr={mr} ml={ml}>
      <SInputsWrapper>
        {data.map((field) => {
          return (
            <SInputWrapper key={field}>
              <SInput
                ref={register()}
                name={name}
                type="radio"
                value={field}
                defaultChecked={defaultValue === field}
                {...rest}
              />
              {sideLabel || showRadioLabel ? (
                <SLabel>{sideLabel ?? field}</SLabel>
              ) : null}
            </SInputWrapper>
          );
        })}
      </SInputsWrapper>
      {displayError && name && errors?.[name]?.message ? (
        <ErrorText>{errors?.[name]?.message}</ErrorText>
      ) : null}
    </SWrapper>
  );
};
