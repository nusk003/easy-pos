import { toast } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { Form } from '@src/components/templates';
import { validationResolver } from '@src/util/form';
import { sdk } from '@src/xhr/graphql-request';
import { useHotel } from '@src/xhr/query';
import { useMewsServices } from '@src/xhr/query/mews-services.query';
import React, { useMemo } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as z from 'zod';

const SWrapper = styled.div`
  width: 100%;
`;

const formSchema = z.object({
  mewsSettings: z.object({
    orderableServiceId: z.string(),
    bookableServiceId: z.string(),
  }),
});

type ManageMarketplaceIntegrationModalSettingsFormValues = z.infer<
  typeof formSchema
>;

interface Props {
  onClose: () => void;
}

export const ManageMarketplaceIntegrationModalSettingsFormMews: React.FC<Props> =
  ({ onClose, ...rest }) => {
    const { data: hotel } = useHotel(false);

    const { data: mewsServices } = useMewsServices();

    const orderableServices = useMemo(
      () => mewsServices?.filter(({ type }) => type === 'Orderable'),
      [mewsServices]
    );

    const bookableServices = useMemo(
      () => mewsServices?.filter(({ type }) => type === 'Reservable'),
      [mewsServices]
    );

    const formMethods = useForm({
      validationContext: formSchema,
      validationResolver: validationResolver,
      defaultValues: {
        mewsSettings: {
          orderableServiceId: mewsServices?.find(
            ({ id }) =>
              id === hotel?.pmsSettings?.mewsSettings?.orderableServiceId
          )?.name,
          bookableServiceId: mewsServices?.find(
            ({ id }) =>
              id === hotel?.pmsSettings?.mewsSettings?.bookableServiceId
          )?.name,
        },
      },
    });

    const onSubmit = async (
      formValues: ManageMarketplaceIntegrationModalSettingsFormValues
    ) => {
      formValues.mewsSettings.bookableServiceId =
        mewsServices?.find(
          ({ name }) => name === formValues.mewsSettings.bookableServiceId
        )?.id || '';
      formValues.mewsSettings.orderableServiceId =
        mewsServices?.find(
          ({ name }) => name === formValues.mewsSettings.orderableServiceId
        )?.id || '';
      const toastId = toast.loader('Configuring');

      try {
        await sdk.updateHotel({
          data: { pmsSettings: { ...hotel?.pmsSettings, ...formValues } },
        });
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
              label="Select your orderable service"
              items={
                orderableServices?.map(({ name }) => name) || ['Loading...']
              }
              name="mewsSettings.orderableServiceId"
            />
            <Inputs.Select
              label="Select your bookable service"
              items={
                bookableServices?.map(({ name }) => name) || ['Loading...']
              }
              name="mewsSettings.bookableServiceId"
            />
            <Form.Submit loading={!mewsServices} onCancel={onClose}>
              Configure
            </Form.Submit>
          </Form.Provider>
        </FormContext>
      </SWrapper>
    );
  };
