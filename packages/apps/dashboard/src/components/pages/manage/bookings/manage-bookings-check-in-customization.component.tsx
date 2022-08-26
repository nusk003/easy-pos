import { BookingsSettings } from '@hm/sdk';
import { Text } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import {
  Form,
  ManageBookingsCheckInProgressButtons,
  ManageFormSection,
} from '@src/components/templates';
import { useStore } from '@src/store';
import { validationResolver } from '@src/util/form';
import { useHotel } from '@src/xhr/query';
import React, { useCallback, useEffect, useMemo } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import * as z from 'zod';

const checkInMessageSchema = z
  .object({
    title: z.string().nonempty('Please enter a title'),
    message: z.string().nonempty('Please enter a message'),
  })
  .optional()
  .nullable();

const formSchema = z.object({
  customization: z.object({
    checkInStart: checkInMessageSchema,
    checkInReview: checkInMessageSchema,
    checkInSuccess: checkInMessageSchema,
    checkInUnsuccessful: checkInMessageSchema,
  }),
});

export type ManageBookingsCheckInCustomizationFormValues = z.infer<
  typeof formSchema
>;

interface Props {
  onUpdate: (
    formValues: ManageBookingsCheckInCustomizationFormValues,
    isLastStep: boolean
  ) => void;
}

export const ManageBookingsCheckInCustomization: React.FC<Props> = ({
  onUpdate,
}) => {
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
    if (!bookingsSettings?.customization) {
      return {};
    }

    return { customization: bookingsSettings?.customization };
  }, [bookingsSettings]);

  const formMethods = useForm<ManageBookingsCheckInCustomizationFormValues>({
    defaultValues,
    validationContext: formSchema,
    validationResolver: validationResolver,
  });

  const onSubmit = async (
    formValues: ManageBookingsCheckInCustomizationFormValues
  ) => {
    await onUpdate(formValues, true);
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
          title="App interface content"
          description="Customise the content of your app to make sure it aligns with the tone of voice of your brand "
        >
          <div>
            <Text.Body> Start of check-in content</Text.Body>
            <Text.Descriptor mt="4px">
              Guests will see this message first as they begin checking in via
              the app
            </Text.Descriptor>
          </div>
          <Inputs.Text
            name="customization.checkInStart.title"
            label="Title"
            placeholder="Welcome"
          />
          <Inputs.Text
            name="customization.checkInStart.message"
            label="Message"
            placeholder="We can’t wait to welcome you here at London. Check in for your stay by completing the following steps."
          />

          <div>
            <Text.Body mt="16px"> Ready for review check-in content</Text.Body>
            <Text.Descriptor mt="4px">
              Guests will see this message when they successfully complete
              checking in via the app
            </Text.Descriptor>
          </div>
          <Inputs.Text
            name="customization.checkInReview.title"
            label="Title"
            placeholder="Check-in is awaiting review"
          />
          <Inputs.Text
            name="customization.checkInReview.message"
            label="Message"
            placeholder="You have submitted your check-in details for review. We will get back to you shortly!"
          />

          <div>
            <Text.Body mt="16px"> Successful check-in content</Text.Body>
            <Text.Descriptor mt="4px">
              Guests will see this message when they successfully complete
              checking in via the app, together with any list of arrival
              instructions
            </Text.Descriptor>
          </div>
          <Inputs.Text
            name="customization.checkInSuccess.title"
            label="Title"
            placeholder="Check-in review successful"
          />
          <Inputs.Text
            name="customization.checkInSuccess.message"
            label="Message"
            placeholder="You have successfully checked in for your stay at Elah The Bay. We look forward to welcoming you!"
          />

          <div>
            <Text.Body mt="16px"> Unsuccessful check-in content</Text.Body>
            <Text.Descriptor mt="4px">
              Guests will see this message when they successfully complete
              checking in via the app, together with any list of arrival
              instructions
            </Text.Descriptor>
          </div>
          <Inputs.Text
            name="customization.checkInUnsuccessful.title"
            label="Title"
            placeholder="Unable to check in via app"
          />
          <Inputs.Text
            name="customization.checkInUnsuccessful.message"
            label="Message"
            placeholder="We were unable to verify all your check-in details, please arrive at the front desk to complete check-in."
          />
        </ManageFormSection>

        <ManageBookingsCheckInProgressButtons
          enableFinish
          onCancel={() => {
            history.push('arrival');
          }}
        />
      </Form.Provider>
    </FormContext>
  );
};
