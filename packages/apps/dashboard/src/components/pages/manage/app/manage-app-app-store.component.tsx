import { toast } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
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
import * as z from 'zod';

const formSchema = z.object({
  app: z.object({
    metadata: z.object({
      title: z
        .string()
        .max(30, 'Name is too long')
        .nonempty('Please enter a valid name'),
      subtitle: z
        .string()
        .max(30, 'Subtitle is too long')
        .nonempty('Please enter a valid subtitle'),
      shortDescription: z
        .string()
        .max(80, 'Promotional text is too long')
        .nonempty('Please enter valid promotional text'),
      fullDescription: z
        .string()
        .max(4000, 'Description is too long')
        .nonempty('Please enter a valid description'),
      keywords: z.string().nonempty('Please enter valid keywords'),
    }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export const ManageAppAppStore = () => {
  const { data: hotel } = useHotel();

  const [submitLoading, setSubmitLoading] = useState(false);

  const hotelAppMetadata = hotel?.app?.metadata;

  const formMethods = useForm<FormValues>({
    defaultValues: {
      app: {
        metadata: {
          title: hotelAppMetadata?.title || undefined,
          subtitle: hotelAppMetadata?.subtitle || undefined,
          shortDescription: hotelAppMetadata?.shortDescription || undefined,
          fullDescription: hotelAppMetadata?.fullDescription || undefined,
          keywords: hotelAppMetadata?.keywords || undefined,
        },
      },
    },
    validationResolver,
    validationContext: formSchema,
  });

  const handleSubmit = async (formValues: FormValues) => {
    setSubmitLoading(true);

    try {
      await sdk.updateHotel({
        data: formValues,
      });
      toast.info('Successfully updated settings');
    } catch {
      toast.warn('Unable to update settings');
    }

    setSubmitLoading(false);
  };

  return (
    <>
      <FormContext {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
          <Header backgroundColor="#fafafa" title="App store" />
          <ManageFormWrapper>
            <ManageFormSection
              title="Publishing"
              description="Add required information for publishing your app to the Apple App Store and Google Play Store"
            >
              <Inputs.Text
                name="app.metadata.title"
                label="Name"
                maxCharacters={30}
                placeholder="Elah London"
              />
              <Inputs.Text
                name="app.metadata.subtitle"
                label="Subtitle"
                maxCharacters={30}
                placeholder="Re-imagined guest experience."
              />
              <Inputs.Text
                name="app.metadata.shortDescription"
                label="Promotional text"
                maxCharacters={80}
                placeholder="Instantly browse the hotel and order room service straight from the app."
              />
              <Inputs.Text
                name="app.metadata.fullDescription"
                label="Description"
                multiLine
                maxCharacters={4000}
                placeholder={
                  'Hospitality just got an upgrade.\n\nA full-stack guest experience solution that taps into the possibilities of everyone’s most-loved device. Deployed and backed by a powerful cloud-based console for hoteliers.\n\nA beautifully integrated ecosystem where hotels are at the epicentre.\n\nDownload our guest app experience.\n\nThe platform is available for hotels.'
                }
              />
              <Inputs.Text
                name="app.metadata.keywords"
                label="Keywords"
                placeholder="Hotel, Travel, Room, Service, Guest, Experience, Hospitality, Manager, Concierge, Itinerary"
              />
            </ManageFormSection>
            <Form.Submit loading={submitLoading}>Save</Form.Submit>
          </ManageFormWrapper>
        </form>
      </FormContext>
    </>
  );
};
