import { Link } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { theme } from '@src/components/theme';
import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { AiFillDelete } from 'react-icons/ai';
import styled from 'styled-components';
import { CustomFieldType } from '@hm/sdk';

interface Props {
  name: string;
}

const SInputsWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: left;
  gap: 16px;
  align-items: baseline;
`;

const SDeleteButton = styled(AiFillDelete).attrs({
  fill: theme.textColors.blue,
})`
  cursor: pointer;
  user-select: none;
`;

export const ManageBookingsCheckInCustomFields: React.FC<Props> = ({
  name,
}) => {
  const { control } = useFormContext();

  const { append, remove, fields } = useFieldArray({ control, name });

  return (
    <>
      {fields.map((item, idx) => {
        return (
          <SInputsWrapper key={item.id}>
            <Inputs.Text name={`${name}[${idx}].title`} mt={8} />
            <Inputs.Select
              items={[
                { label: 'Toggle', value: CustomFieldType.Boolean },
                { label: 'Text', value: CustomFieldType.String },
              ]}
              name={`${name}[${idx}].type`}
            />
            <SDeleteButton onClick={() => remove(idx)} />
          </SInputsWrapper>
        );
      })}
      <Link
        mt={8}
        disableOnClick={false}
        onClick={() => append({ title: '', type: 'Toggle' })}
      >
        + Add a custom field
      </Link>
    </>
  );
};
