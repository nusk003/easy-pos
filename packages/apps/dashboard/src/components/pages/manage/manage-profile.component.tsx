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
import { useUser } from '@src/xhr/query';
import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  firstName: z.string().nonempty('Please enter a valid first name'),
  lastName: z.string().nonempty('Please enter a valid last name'),
  email: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const ManageProfile = () => {
  const { data: user, mutate: mutateUser } = useUser();

  const [submitLoading, setSubmitLoading] = useState(false);

  const formMethods = useForm<FormValues>({
    defaultValues: {
      email: user?.email,
      firstName: user?.firstName || undefined,
      lastName: user?.lastName || undefined,
    },
    validationResolver,
    validationContext: formSchema,
  });

  const handleSubmit = async (formValues: FormValues) => {
    setSubmitLoading(true);

    try {
      delete formValues.email;
      await sdk.updateUser({ data: formValues });
      toast.info('Successfully updated settings');
      await mutateUser();
    } catch {
      toast.warn('Unable to update settings');
    }

    setSubmitLoading(false);
  };

  return (
    <FormContext {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
        <Header backgroundColor="#fafafa" title="Profile" />
        <ManageFormWrapper>
          <ManageFormSection
            title="Personal details"
            description="Your personal information used to identify yourself to your team"
          >
            <Inputs.Text name="firstName" label="First name" />
            <Inputs.Text name="lastName" label="Last name" />
            <Inputs.Text disabled name="email" label="Email Address" />
          </ManageFormSection>
          <Form.Submit loading={submitLoading}>Save</Form.Submit>
        </ManageFormWrapper>
      </form>
    </FormContext>
  );
};
