import React from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { Input as TextInput } from './text.component';

const Input = styled(TextInput).attrs({
  type: 'time',
})`
  min-width: 40px;
  height: 25px;
  display: flex;
  align-items: center;
  text-align: center;
  padding: 0 0;
  background: transparent;

  ::-webkit-clear-button {
    display: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  -moz-appearance: textfield;

  :hover {
    outline: none;
    background: transparent;
  }

  :focus {
    outline: none;
    background: transparent;
  }
`;

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  name: string;
  defaultValue?: string | undefined;
  noRegister?: boolean;
}

export const Time: React.FC<Props> = ({ name, defaultValue, noRegister }) => {
  const { register } = useFormContext();

  return (
    <Input
      name={name}
      defaultValue={defaultValue}
      ref={noRegister ? undefined : register}
    />
  );
};
