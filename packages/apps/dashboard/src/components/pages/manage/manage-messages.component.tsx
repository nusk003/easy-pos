import { Availability, MessagesSettings } from '@hm/sdk';
import { Text, toast } from '@src/components/atoms';
import { Inputs, ToggleDropdown } from '@src/components/molecules';
import { FormInputs } from '@src/components/organisms';
import { availabilitySchema } from '@src/components/organisms/form-inputs/availability.component';
import {
  Form,
  Header,
  ManageFormSection,
  ManageFormWrapper,
} from '@src/components/templates';
import { validationResolver } from '@src/util/form';
import { sdk } from '@src/xhr/graphql-request';
import { useHotel } from '@src/xhr/query';
import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import * as z from 'zod';

enum AvailabilityEnabled {
  Always = 'Always available',
  Other = 'Only available during opening times',
}

const formSchema = z.object({
  enabled: z.boolean(),
  checkedInOnly: z.boolean(),
  availability: availabilitySchema.or(z.undefined()),
  awayMessage: z.object({
    message: z.string(),
    showTime: z.boolean(),
  }),
  availabilityEnabled: z
    .enum([AvailabilityEnabled.Always, AvailabilityEnabled.Other])
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const ManageMessages = () => {
  const history = useHistory();

  const { data: hotel } = useHotel();

  const [submitLoading, setSubmitLoading] = useState(false);

  const defaultValues = {
    enabled: !!hotel?.messagesSettings?.enabled,
    checkedInOnly: hotel?.messagesSettings?.checkedInOnly,
    availability: hotel?.messagesSettings?.availability,
    awayMessage: hotel?.messagesSettings?.awayMessage,
  };

  const formMethods = useForm<FormValues>({
    defaultValues: defaultValues as unknown as FormValues,
    validationContext: formSchema,
    validationResolver: validationResolver,
  });

  const handleSubmit = async (formValues: FormValues) => {
    const toastId = toast.loader('Updating messages settings');

    if ('availabilityEnabled' in formValues) {
      if (formValues.availabilityEnabled === AvailabilityEnabled.Always) {
        delete formValues.availability;
      }

      delete formValues.availabilityEnabled;
    }

    const messagesSettings: MessagesSettings = formValues;

    setSubmitLoading(true);

    try {
      await sdk.updateHotel({
        data: {
          messagesSettings,
        },
      });
      toast.update(toastId, 'Messages settings updated successfully');
    } catch {
      toast.update(toastId, 'Unable to update messages settings');
    }

    setSubmitLoading(false);
  };

  const availabilityEnabled = formMethods.watch('availabilityEnabled');

  return (
    <>
      <FormContext {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
          <Header
            backgroundColor="#fafafa"
            title="Messages"
            indicator={
              <ToggleDropdown
                enabled={!!hotel?.messagesSettings?.enabled}
                dropdown={false}
              />
            }
            onBack={
              !hotel?.messagesSettings?.enabled
                ? () => {
                    history.push('/manage');
                  }
                : undefined
            }
          />
          <ManageFormWrapper>
            <ManageFormSection
              title="Setup"
              description="Enable or disable messaging"
            >
              <Text.Body fontWeight="semibold">
                What would you like to set up?
              </Text.Body>
              <Inputs.Checkbox
                toggle
                name="enabled"
                boldSideLabel
                sideLabel="Enable messaging via app"
                sideLabelDescription="A channel to keep you connected with the guests in your hotel"
              />
            </ManageFormSection>

            <ManageFormSection
              title="Availability"
              description="Restrict chat to control who can send messages. Team availability settings can help manage expectations."
            >
              <div>
                <Text.Body fontWeight="medium">
                  Chat available only when checked in
                </Text.Body>
                <Text.Descriptor mt="4px">
                  Enable messaging to guests that have checked in to the hotel.
                  Visitors that have not checked in will not be able to send any
                  messages.
                </Text.Descriptor>
              </div>

              <Inputs.Checkbox toggle name="checkedInOnly" />

              <div>
                <Text.Body fontWeight="medium">Team availability</Text.Body>
                <Text.Descriptor mt="4px">
                  Set expectations for when your team is available and should be
                  replying to chats
                </Text.Descriptor>
              </div>
              <Inputs.Radio
                name="availabilityEnabled"
                data={[AvailabilityEnabled.Always, AvailabilityEnabled.Other]}
                defaultValue={
                  defaultValues?.availability
                    ? AvailabilityEnabled.Other
                    : AvailabilityEnabled.Always
                }
              />

              {availabilityEnabled === AvailabilityEnabled.Other ? (
                <Form.Section>
                  <FormInputs.Availability
                    defaultValues={defaultValues?.availability as Availability}
                  />
                </Form.Section>
              ) : null}

              <div>
                <Text.Body mt="16px" fontWeight="medium">
                   Away message
                </Text.Body>
                <Text.Descriptor mt="4px">
                  Shown outside opening times
                </Text.Descriptor>
              </div>

              <Inputs.Text
                name="awayMessage.message"
                placeholder="Please leave a message and we’ll get back to you as soon as we can!"
              />
              <Inputs.Checkbox
                name="awayMessage.showTime"
                sideLabel="Show when your team will be back"
                sideLabelDescription="For example, “Back in 4 hours”"
              />
            </ManageFormSection>
            <Form.Submit loading={submitLoading}>Save</Form.Submit>
          </ManageFormWrapper>
        </form>
      </FormContext>
    </>
  );
};
