import { Text } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import {
  ManageBookingsCheckInProgressButtons,
  ManageBookingsCheckInReminderFields,
  Form,
  ManageFormSection,
} from '@src/components/templates';
import { useStore } from '@src/store';
import { validationResolver } from '@src/util/form';
import { useHotel } from '@src/xhr/query';
import React, { useCallback, useMemo } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import * as z from 'zod';

const formSchema = z.object({
  departure: z.object({
    notifications: z.object({
      app: z.boolean().optional().nullable(),
      email: z.boolean().optional().nullable(),
      reminders: z
        .array(
          z.object({
            value: z
              .string()
              .refine((val) => !!val, 'Please enter a number')
              .transform((val) => {
                return Number(val);
              }),
            duration: z.string(),
          })
        )
        .optional()
        .nullable(),
    }),
  }),
});

export type ManageBookingsCheckInDepartureFormValues = z.infer<
  typeof formSchema
>;

interface Props {
  onUpdate: (formValues: ManageBookingsCheckInDepartureFormValues) => void;
}

export const ManageBookingsCheckInDeparture: React.FC<Props> = ({
  onUpdate,
}) => {
  const history = useHistory();

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
    if (!bookingsSettings?.departure) {
      return {};
    }
    const { notifications } = bookingsSettings?.departure;
    return {
      departure: {
        ...bookingsSettings?.departure,
        notifications: {
          ...notifications,
          reminders: notifications.reminders
            ? notifications.reminders
            : undefined,
        },
      },
    };
  }, [bookingsSettings]);

  const formMethods = useForm<ManageBookingsCheckInDepartureFormValues>({
    validationResolver: validationResolver,
    validationContext: formSchema,
    defaultValues,
  });

  const onSubmit = async (
    formValues: ManageBookingsCheckInDepartureFormValues
  ) => {
    await onUpdate(formValues);

    if (!hotel?.bookingsSettings) {
      history.push('customization');
    }
  };

  return (
    <FormContext {...formMethods}>
      <Form.Provider onSubmit={formMethods.handleSubmit(onSubmit)}>
        <ManageFormSection
          title="Automated notifications"
          description="Add automated check-out reminders for guests ahead of their departure"
        >
          <Text.Body mb="4px">Notification methods</Text.Body>
          <Text.Descriptor mb={16}>
            Guests will be sent a reminder about their upcoming departure ahead
            of time in the following ways
          </Text.Descriptor>

          <Inputs.Checkbox
            name="departure.notifications.app"
            boldSideLabel
            sideLabel="App notifications"
            mb={8}
          />
          <Inputs.Checkbox
            name="departure.notifications.email"
            boldSideLabel
            sideLabel="Email"
          />

          <Text.Body mb="4px" mt={16}>
            Reminders
          </Text.Body>
          <Text.Descriptor>
            Set the time that guests should be automatically sent a reminder
            about their upcoming departure
          </Text.Descriptor>

          <ManageBookingsCheckInReminderFields name="departure.notifications.reminders" />
        </ManageFormSection>

        <ManageBookingsCheckInProgressButtons
          onCancel={() => {
            history.push('arrival');
          }}
        />
      </Form.Provider>
    </FormContext>
  );
};
