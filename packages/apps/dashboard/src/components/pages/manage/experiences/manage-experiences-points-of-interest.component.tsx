import { Text, toast } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { PointsOfInterestToggle } from '@src/components/organisms';
import {
  Form,
  Header,
  ManageFormSection,
  ManageFormWrapper,
  PointsOfInterestSetupModal,
} from '@src/components/templates';
import { validationResolver } from '@src/util/form';
import { sdk } from '@src/xhr/graphql-request';
import { useAttraction } from '@src/xhr/query';
import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import * as z from 'zod';

const formSchema = z.object({
  enabled: z.boolean(),
  description: z.string().max(500, 'Description is too long'),
});

type FormValues = z.infer<typeof formSchema>;

export const ManageExperiencesPointsOfInterest = () => {
  const history = useHistory();

  const { data: attraction, mutate: mutateAttraction } = useAttraction(
    true,
    false
  );

  const [submitLoading, setSubmitLoading] = useState(false);
  const [isSetupModalVisible, setIsSetupModalVisible] = useState(false);

  const setupFormMethods = useForm<FormValues>({
    defaultValues: {
      enabled: !!attraction?.enabled,
      description: attraction?.description || undefined,
    },
    validationContext: formSchema,
    validationResolver,
  });

  const handleSubmit = async (formValues: FormValues) => {
    setSubmitLoading(true);

    const toastId = toast.loader('Updating points of interest');

    try {
      await sdk.updateAttraction({ data: formValues });
      toast.update(toastId, 'Successfully updated points of interest');
      await mutateAttraction();
    } catch {
      toast.update(toastId, 'Unable to update points of interest');
    }

    setSubmitLoading(false);
  };

  return (
    <>
      <FormContext {...setupFormMethods}>
        <form onSubmit={setupFormMethods.handleSubmit(handleSubmit)}>
          <Header
            backgroundColor="#fafafa"
            title="Points of Interest"
            indicator={<PointsOfInterestToggle dropdown={false} />}
            onBack={
              !attraction?.enabled ? () => history.push('/manage') : undefined
            }
          />

          <ManageFormWrapper>
            <ManageFormSection
              title="Setup"
              description="Enable or disable points of interest"
            >
              <Text.Body fontWeight="semibold">
                What would you like to set up?
              </Text.Body>
              <Inputs.Checkbox
                noRegister={!attraction}
                toggle
                name="enabled"
                defaultValue={!attraction ? isSetupModalVisible : undefined}
                onClick={
                  !attraction
                    ? () => {
                        setIsSetupModalVisible(true);
                      }
                    : undefined
                }
                boldSideLabel
                sideLabel={`${
                  attraction ? 'Enable' : 'Setup'
                } points of interest via app`}
                sideLabelDescription="Let your guests to explore nearby attractions"
              />
            </ManageFormSection>

            <ManageFormSection
              title="General"
              description="Manage general settings for points of interest"
            >
              <Inputs.Text
                label="Description"
                placeholder="Elah London sits in the heart of Central London, the crowning jewel of the fashionable Marylebone neighbourhood, with many fascinating places to visit right on our doorstep."
                name="description"
                multiLine
                maxCharacters={500}
              />
            </ManageFormSection>
            <Form.Submit loading={submitLoading}>Save</Form.Submit>
          </ManageFormWrapper>
        </form>
      </FormContext>

      <PointsOfInterestSetupModal
        onClose={() => setIsSetupModalVisible(false)}
        visible={isSetupModalVisible}
      />
    </>
  );
};
