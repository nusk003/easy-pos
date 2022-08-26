import { Availability as AvailabilityModel } from '@hm/sdk';
import { Text } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { ErrorText } from '@src/components/molecules/inputs/text.component';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import * as z from 'zod';

const SWrapper = styled.div`
  display: grid;
  grid-gap: 10px;
`;

const STimePickerWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  justify-content: left;
  grid-gap: 12px;
  padding: 0 12px;
  border: 1px solid #dadce1;
  box-shadow: 0px 0px 4px rgba(170, 177, 196, 0.25);
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

const SDayWrapper = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 30px 60px auto;
`;

interface EnabledDays {
  m: boolean;
  t: boolean;
  w: boolean;
  th: boolean;
  f: boolean;
  sa: boolean;
  s: boolean;
}

type Days = 'M' | 'T' | 'W' | 'Th' | 'F' | 'Sa' | 'S';
type LowerDays = 'm' | 't' | 'w' | 'th' | 'f' | 'sa' | 's';
const dayNames: Array<Days> = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'S'];

interface Props {
  defaultValues?: AvailabilityModel;
}

const daySchema = z.object({
  start: z.string().nonempty(),
  end: z.string().nonempty(),
});

export const availabilitySchema = z.object({
  m: daySchema.optional(),
  t: daySchema.optional(),
  w: daySchema.optional(),
  th: daySchema.optional(),
  f: daySchema.optional(),
  sa: daySchema.optional(),
  s: daySchema.optional(),
});

export const Availability: React.FC<Props> = ({ defaultValues }) => {
  const { errors, register, unregister, getValues } = useFormContext();

  const [enabledDays, setEnabledDays] = useState<EnabledDays>(() => {
    const state: Partial<EnabledDays> = {};

    dayNames.forEach((dayName) => {
      const day = dayName.toLowerCase() as LowerDays;
      if (defaultValues?.[day]?.start) {
        state[day] = true;
      } else {
        state[day] = false;
      }
    });

    return state as EnabledDays;
  });

  useEffect(() => {
    setEnabledDays(() => {
      const state: Partial<EnabledDays> = {};

      dayNames.forEach((dayName) => {
        const day = dayName.toLowerCase() as LowerDays;
        if (defaultValues?.[day]?.start) {
          state[day] = true;
        } else {
          state[day] = false;
        }
      });

      return state as EnabledDays;
    });
  }, [defaultValues]);

  const handleToggleCheckbox = React.useCallback(
    (value: boolean, day: string) => {
      if (value) {
        register({ name: `availability.${day}.start` });
        register({ name: `availability.${day}.end` });
        setEnabledDays((s) => ({ ...s, [day]: true }));
      } else {
        unregister(`availability.${day}.start`);
        unregister(`availability.${day}.end`);
        setEnabledDays((s) => ({ ...s, [day]: false }));
      }
    },
    [register, unregister]
  );

  return (
    <SWrapper>
      {dayNames.map((dayName) => {
        const day = dayName.toLowerCase() as LowerDays;

        return (
          <SDayWrapper key={day}>
            <Text.Body>{dayName}</Text.Body>
            <Inputs.Checkbox
              name={`availability.${day}.enabled`}
              onClick={(value) => {
                handleToggleCheckbox(value, day);
              }}
              defaultValue={enabledDays[day]}
              noRegister
            />
            <STimePickerWrapper>
              <Inputs.Time
                defaultValue="09:00"
                noRegister={!enabledDays[day]}
                name={`availability.${day}.start`}
              />
              <Text.Notes>to</Text.Notes>
              <Inputs.Time
                defaultValue="22:00"
                noRegister={!enabledDays[day]}
                name={`availability.${day}.end`}
              />
            </STimePickerWrapper>
          </SDayWrapper>
        );
      })}
      {errors?.availability ? (
        <ErrorText>
          {errors?.availability ? 'Please enter availability' : null}
        </ErrorText>
      ) : null}
    </SWrapper>
  );
};
