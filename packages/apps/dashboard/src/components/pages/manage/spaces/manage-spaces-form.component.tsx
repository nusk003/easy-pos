import { Space } from '@hm/sdk';
import { Text, toast } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
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
import { useSpaces } from '@src/xhr/query';
import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components';
import * as z from 'zod';

const SFormSection = styled(Form.Provider).attrs({ as: 'div' })``;

const formSchema = z.object({
  name: z.string().nonempty('Please enter a name'),
  location: z
    .string()
    .nonempty('Please enter a location')
    .max(500, 'Location is too long'),
  availability: availabilitySchema,
});

type FormValues = z.infer<typeof formSchema>;

export const ManageSpacesForm: React.FC = () => {
  const history = useHistory();
  const { state } = useLocation<{ space: Space; redirect: string }>();

  const { mutate: mutateSpaces } = useSpaces();

  const defaultValues = state?.space;

  const formMethods = useForm<FormValues>({
    defaultValues: defaultValues as FormValues,
    validationResolver,
    validationContext: formSchema,
  });

  const handleSubmit = async (formValues: FormValues) => {
    try {
      if (defaultValues) {
        await sdk.updateSpace({
          where: { id: defaultValues.id },
          data: formValues,
        });
        toast.info('Successfully updated space');
        await mutateSpaces();
      } else {
        await sdk.createSpace({
          ...formValues,
          enabled: true,
        });
        toast.info('Successfully created space');
        await mutateSpaces();
      }

      if (state?.redirect) {
        history.push(state.redirect);
      } else {
        history.push('/manage/spaces/all');
      }
    } catch {
      toast.info(
        defaultValues ? 'Unable to update space' : 'Unable to create space'
      );
    }
  };

  return (
    <FormContext {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
        <Header
          backgroundColor="#fafafa"
          title={defaultValues ? defaultValues.name : 'Add a space'}
        />
        <ManageFormWrapper>
          <ManageFormSection
            title="General"
            description="Add general information about your space"
          >
            <SFormSection>
              <Inputs.Text
                label="Name"
                name="name"
                placeholder="The Quarterdeck Restaurant"
              />
              <Inputs.Text
                label="Location"
                placeholder="Ground floor of Elah the Bay"
                name="location"
                maxCharacters={500}
              />
            </SFormSection>
          </ManageFormSection>

          <ManageFormSection
            title="Availability"
            description="Add opening times to your space"
          >
            <SFormSection>
              <div>
                <Text.Body fontWeight="medium">Availability</Text.Body>
                <Text.Descriptor mt="4px">
                  Guests will be able to arrive at your space within its opening
                  hours
                </Text.Descriptor>
              </div>
              <FormInputs.Availability
                defaultValues={defaultValues?.availability}
              />
            </SFormSection>
          </ManageFormSection>

          <Form.Submit>{defaultValues ? 'Save' : 'Add space'}</Form.Submit>
        </ManageFormWrapper>
      </form>
    </FormContext>
  );
};
