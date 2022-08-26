import { Text } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { TextInputProps } from '@src/components/molecules/inputs/text.component';
import React, { useState } from 'react';
import styled from 'styled-components';

const SWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: max-content;
  grid-gap: 16px;
  align-items: flex-start;
`;

const STextInputWrapper = styled.div`
  display: grid;
  grid-gap: 16px;
`;

interface Props {
  name: string;
  label?: string;
  checkboxLabel?: string;
  toggle?: boolean;
  textInputProps?: Omit<TextInputProps, 'name'>;
}

export const CheckboxInput: React.FC<Props> = ({
  name,
  label,
  checkboxLabel,
  toggle,
  textInputProps,
}) => {
  const [state, setState] = useState({ disabled: true });

  return (
    <div>
      <Text.Body mb="medium">{label}</Text.Body>
      <SWrapper>
        <div>
          <Inputs.Checkbox
            name={`${name}.enabled`}
            toggle={toggle}
            onClick={() => setState((s) => ({ ...s, disabled: !s.disabled }))}
          />
        </div>
        <STextInputWrapper>
          {checkboxLabel}
          <Inputs.Text
            name={`${name}.value`}
            disabled={state.disabled}
            {...textInputProps}
          />
        </STextInputWrapper>
      </SWrapper>
    </div>
  );
};
