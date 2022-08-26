import { toast } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { Form } from '@src/components/templates';
import { validationResolver } from '@src/util/form';
import { sdk } from '@src/xhr/graphql-request';
import { useApaleoProperties, useHotel } from '@src/xhr/query';
import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as z from 'zod';

const SWrapper = styled.div`
  width: 100%;
`;

const formSchema = z.object({
  pmsId: z.string(),
});

type ManageMarketplaceIntegrationModalSettingsFormValues = z.infer<
  typeof formSchema
>;

interface Props {
  onClose: () => void;
}

export const ManageMarketplaceIntegrationModalSettingsFormApaleo: React.FC<Props> =
  ({ onClose, ...rest }) => {
    const { data: hotel } = useHotel(false);

    const { data: properties } = useApaleoProperties();

    const formMethods = useForm({
      validationContext: formSchema,
      validationResolver: validationResolver,
      defaultValues: {
        pmsId: properties?.find(({ id }) => id === hotel?.pmsSettings?.pmsId)
          ?.name,
      },
    });

    const onSubmit = async (
      formValues: ManageMarketplaceIntegrationModalSettingsFormValues
    ) => {
      formValues.pmsId =
        properties?.find(({ name }) => name === formValues.pmsId)?.id || '';

      const toastId = toast.loader('Configuring');

      try {
        await sdk.updateHotel({ data: { pmsSettings: formValues } });
        toast.update(toastId, 'Successfully updated PMS settings');
        onClose();
      } catch {
        toast.update(toastId, 'Unable to update PMS settings');
      }
    };

    return (
      <SWrapper {...rest}>
        <FormContext {...formMethods}>
          <Form.Provider onSubmit={formMethods.handleSubmit(onSubmit)}>
            <Inputs.Select
              label="Select your property"
              items={properties?.map(({ name }) => name) || ['Loading...']}
              name="pmsId"
            />
            <Form.Submit loading={!properties} onCancel={onClose}>
              Configure
            </Form.Submit>
          </Form.Provider>
        </FormContext>
      </SWrapper>
    );
  };
