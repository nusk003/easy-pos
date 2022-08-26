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

const disableAppFormScheme = z.object({
  app: z.object({
    disabled: z.boolean().optional(),
    disabledReason: z.string().optional(),
  }),
});
type DisableAppFormSchema = z.infer<typeof disableAppFormScheme>;

type FormSchema = DisableAppFormSchema;

export const ManageAppPreferences = () => {
  const { data: hotel } = useHotel();

  const [submitLoading, setSubmitLoading] = useState(false);

  const disableAppFormMethods = useForm<DisableAppFormSchema>({
    defaultValues: {
      app: {
        disabled: !!hotel?.app?.disabled,
        disabledReason: hotel?.app?.disabledReason || undefined,
      },
    },
    validationResolver,
    validationContext: disableAppFormScheme,
  });

  const handleSubmit = async (formValues: FormSchema) => {
    setSubmitLoading(true);

    try {
      await sdk.updateHotel({
        data: {
          app: formValues.app,
        },
      });
      toast.info('Successfully updated settings');
    } catch {
      toast.warn('Unable to update settings');
    }

    setSubmitLoading(false);
  };

  return (
    <>
      <FormContext {...disableAppFormMethods}>
        <form onSubmit={disableAppFormMethods.handleSubmit(handleSubmit)}>
          <Header backgroundColor="#fafafa" title="App preferences" />
          <ManageFormWrapper>
            <ManageFormSection
              title="Disable app"
              description="Disable all features of your app from being accessed by guests"
            >
              <Inputs.Checkbox
                name="app.disabled"
                toggle
                boldSideLabel
                sideLabel="Disable App"
              />
              <Inputs.Text
                name="app.disabledReason"
                label="Disabled reason"
                note="This reason will be displayed to guests that try to access your app"
                placeholder="Sorry our app is currently unavailable. We apologise for any inconvenience this may cause."
              />
            </ManageFormSection>
            <Form.Submit loading={submitLoading}>Save</Form.Submit>
          </ManageFormWrapper>
        </form>
      </FormContext>
    </>
  );
};
