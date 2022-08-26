import { ReminderDurationType } from '@hm/sdk';
import { Link } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { ErrorText } from '@src/components/molecules/inputs/text.component';
import { theme } from '@src/components/theme';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { AiFillDelete } from 'react-icons/ai';
import styled from 'styled-components';

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

interface Props {
  name: string;
}

export const ManageBookingsCheckInReminderFields: React.FC<Props> = ({
  name,
}) => {
  const { control, errors } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <>
      {fields.map((item, idx) => {
        const field = `${name}[${idx}]`;
        return (
          <SInputsWrapper key={item.id}>
            <Inputs.Text
              mt={8}
              name={`${field}.value`}
              width="20px"
              mask="99"
              textAlign="center"
            />
            <Inputs.Select
              name={`${field}.duration`}
              defaultValue={item.duration}
              items={[
                ReminderDurationType.Minutes,
                ReminderDurationType.Hours,
                ReminderDurationType.Days,
              ]}
            />
            <SDeleteButton onClick={() => remove(idx)} />
          </SInputsWrapper>
        );
      })}
      {!!errors?.[name] && <ErrorText>{errors?.[name]?.message}</ErrorText>}
      <Link
        disableOnClick={false}
        onClick={() => append({ value: 0, duration: 'minutes' })}
        mt={16}
      >
        + Add reminder
      </Link>
    </>
  );
};
