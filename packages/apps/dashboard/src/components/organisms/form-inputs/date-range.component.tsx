import { Text } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import moment from 'moment';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ErrorText } from '@src/components/molecules/inputs/text.component';
import { theme } from '@src/components/theme';

dayjs.extend(utc);

const SRangeWrapper = styled.div`
  border: 1px solid #dadce1;
  box-shadow: 0px 0px 4px rgba(170, 177, 196, 0.25);
  border-radius: 6px;

  display: grid;
  grid-auto-flow: column;
  align-items: center;
  justify-content: left;
  padding: 0 4px;
  border-radius: 6px;
  width: fit-content;
  transition: 0.3s all;

  :hover {
    outline: none;
    border: 1px solid rgba(7, 132, 248, 0.25);
    box-shadow: 0px 0px 4px rgba(170, 177, 196, 0.25);
  }

  :focus {
    outline: none;
    border: 1px solid rgba(7, 132, 248, 0.25);
    box-shadow: 0px 0px 4px rgba(170, 177, 196, 0.25);
  }
`;

const SWrapper = styled.div``;

const SLabel = styled(Text.Body)`
  color: ${theme.textColors.gray};
  margin-bottom: 16px;
`;

interface Props {
  name: string;
  label?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
}

export const DateRange: React.FC<Props> = ({
  name,
  label,
  startPlaceholder,
  endPlaceholder,
}) => {
  const { setValue, getValues, errors } = useFormContext();

  const handleStartDateChange = (startDate: Date) => {
    const endDate = getValues()[`${name}.end`]
      ? getValues()[`${name}.end`]
      : dayjs().toDate();
    if (startDate >= endDate) {
      const tommorrow = moment(startDate).add(1, 'day').toDate();
      setValue(`${name}.end`, tommorrow);
    }
  };

  const handleEndDateChange = (endDate: Date) => {
    const startDate = getValues()[`${name}.start`]
      ? getValues()[`${name}.start`]
      : dayjs().toDate();
    if (startDate >= endDate) {
      const yesterday = moment(endDate).subtract(1, 'day').toDate();
      setValue(`${name}.start`, yesterday);
    }
  };

  return (
    <SWrapper>
      {label ? <SLabel fontWeight="medium">{label}</SLabel> : null}
      <SRangeWrapper>
        <Inputs.Date
          range
          name={`${name}.start`}
          onChange={handleStartDateChange}
          placeholder={startPlaceholder}
          placeholderAlign="center"
        />
        <Text.Notes>to</Text.Notes>
        <Inputs.Date
          range
          name={`${name}.end`}
          onChange={handleEndDateChange}
          placeholder={endPlaceholder}
          placeholderAlign="center"
        />
      </SRangeWrapper>
      {errors[`${name}`]?.message ? (
        <ErrorText>{errors[`${name}`]?.message}</ErrorText>
      ) : null}
    </SWrapper>
  );
};
