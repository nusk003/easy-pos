import { BookingInstructionsDisplayType, BookingsSettings } from '@hm/sdk';
import { Text } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import {
  Form,
  ManageBookingsCheckInArrivalInstructionsFields,
  ManageBookingsCheckInProgressButtons,
  ManageFormSection,
} from '@src/components/templates';
import { useStore } from '@src/store';
import { validationResolver } from '@src/util/form';
import { useHotel } from '@src/xhr/query';
import React, { useCallback, useEffect, useMemo } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';
import * as z from 'zod';

interface SInputGrid extends SpaceProps {
  disabled?: boolean;
}

const SInputGrid = styled.div<SInputGrid>`
  display: grid;
  grid-template-columns: max-content auto;
  gap: 16px;
  align-items: flex-start;

  ${space}
`;

const entryMethodsSchema = z.object({
  appKey: z.boolean(),
  frontDesk: z.boolean(),
});

const instructionSchema = z.object({
  display: z.nativeEnum(BookingInstructionsDisplayType),
  steps: z.array(z.string()).optional(),
});

const formSchema = z.object({
  arrival: z
    .object({
      entryMethods: entryMethodsSchema,
      instructions: instructionSchema.optional().nullable(),
    })
    .partial(),
});

export type ManageBookingsCheckInArrivalFormValues = z.infer<typeof formSchema>;

interface Props {
  onUpdate: (formValues: ManageBookingsCheckInArrivalFormValues) => void;
}

export const ManageBookingsCheckInArrival: React.FC<Props> = ({ onUpdate }) => {
  const history = useHistory();
  const { state } = useLocation<{ bookingsSettings: BookingsSettings }>();

  const { data: hotel } = useHotel();

  const { bookingsSettings } = useStore(
    useCallback(
      ({ bookingsSettings }) => ({
        bookingsSettings,
      }),
      []
    )
  );

  const defaultValues = useMemo(() => {
    if (!bookingsSettings?.arrival) {
      return {
        arrival: {
          entryMethods: {
            appKey: false,
            frontDesk: true,
          },
          instructions: {
            display: BookingInstructionsDisplayType.Numbered,
          },
        },
      };
    }

    const { instructions } = bookingsSettings.arrival;
    return {
      arrival: {
        ...bookingsSettings?.arrival,
        instructions: {
          ...instructions,
          steps: instructions?.steps ? instructions?.steps : undefined,
        },
      },
    };
  }, [bookingsSettings]);

  const formMethods = useForm<ManageBookingsCheckInArrivalFormValues>({
    validationResolver: validationResolver,
    validationContext: formSchema,
    defaultValues: defaultValues as ManageBookingsCheckInArrivalFormValues,
  });

  const onSubmit = async (
    formValues: ManageBookingsCheckInArrivalFormValues
  ) => {
    await onUpdate(formValues);

    if (!hotel?.bookingsSettings) {
      history.push('/manage/bookings/customization', {
        bookingsSettings: { ...bookingsSettings, ...formValues },
      });
    }
  };

  useEffect(() => {
    if (
      hotel &&
      !hotel.bookingsSettings &&
      !bookingsSettings &&
      !state?.bookingsSettings
    ) {
      history.push('/manage/bookings');
    }
  }, [bookingsSettings, history, hotel, state?.bookingsSettings]);

  return (
    <FormContext {...formMethods}>
      <Form.Provider onSubmit={formMethods.handleSubmit(onSubmit)}>
        <ManageFormSection
          title="Arrival procedure"
          description="Manage information about any steps for your guests when they finally arrive at your hotel"
        >
          <div>
            <Text.Body mb="4px">Entry methods</Text.Body>
            <Text.Descriptor>
              Guests have the following available methods for room entry when
              they arrive on the day
            </Text.Descriptor>
          </div>
          <Inputs.Checkbox
            name="arrival.entryMethods.frontDesk"
            boldSideLabel
            sideLabel="Front desk"
            sideLabelDescription="Guests should proceed to your hotel's front desk or
                reception for verification and key collection"
          />
          <Inputs.Checkbox
            disabled
            name="arrival.entryMethods.appKey"
            boldSideLabel
            sideLabel="Mobile key"
            sideLabelDescription="This is currently not available"
          />

          <div>
            <Text.Body mt="8px"> Arrival instructions</Text.Body>
            <Text.Descriptor mt="4px" mb={16}>
              Guests will be shown the following steps when they successfully
              check-in via your app
            </Text.Descriptor>

            <Inputs.Radio
              name="arrival.instructions.display"
              data={BookingInstructionsDisplayType.Numbered}
              sideLabel="Display as numbered list"
              defaultValue="arrival.instructions.display"
            />
            <Inputs.Radio
              name="arrival.instructions.display"
              data={BookingInstructionsDisplayType.Bulleted}
              sideLabel="Display as bulleted list"
              mt={8}
            />

            <ManageBookingsCheckInArrivalInstructionsFields name="arrival.instructions.steps" />
          </div>
        </ManageFormSection>
        <ManageBookingsCheckInProgressButtons
          onCancel={() => {
            history.push('pre-arrival');
          }}
        />
      </Form.Provider>
    </FormContext>
  );
};
