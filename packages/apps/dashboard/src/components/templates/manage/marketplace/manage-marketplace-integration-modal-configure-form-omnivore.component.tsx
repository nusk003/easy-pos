import { Button, Text, toast } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { Form } from '@src/components/templates';
import { __dev__, __omnivore_test_api_key__ } from '@src/constants';
import { validationResolver } from '@src/util/form';
import { sdk } from '@src/xhr/graphql-request';
import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';
import * as z from 'zod';

const formSchema = z.object({
  apiKey: z.string().nonempty('API key must be provided'),
});

type ManageMarketplaceIntegrationModalConfigureFormOmnivoreValues = z.infer<
  typeof formSchema
>;

interface Props extends SpaceProps {
  onClose: () => void;
}

const SWrapper = styled.div<SpaceProps>`
  width: 100%;
  ${space}
`;

const SActionsWrapper = styled.div`
  display: grid;
  margin-top: 32px;
  grid-auto-flow: column;
  justify-content: right;
  grid-gap: 8px;
`;

export const ManageMarketplaceIntegrationModalConfigureFormOmnivore: React.FC<Props> =
  ({ onClose, ...rest }) => {
    const formMethods =
      useForm<ManageMarketplaceIntegrationModalConfigureFormOmnivoreValues>({
        validationContext: formSchema,
        validationResolver,
        ...(__dev__ && {
          defaultValues: {
            apiKey: __omnivore_test_api_key__,
          },
        }),
      });

    const onSubmit = async (
      formValues: ManageMarketplaceIntegrationModalConfigureFormOmnivoreValues
    ) => {
      const toastId = toast.loader('Configuring');

      try {
        await sdk.authorizeOmnivore(formValues);
        onClose();
        toast.update(toastId, 'Successfully configured');
      } catch {
        toast.update(toastId, 'Unable to configure');
      }
    };

    return (
      <SWrapper {...rest}>
        <FormContext {...formMethods}>
          <Form.Provider onSubmit={formMethods.handleSubmit(onSubmit)}>
            <Inputs.Text
              name="apiKey"
              placeholder="API Key"
              label="API Key"
              type="password"
            />
            <Text.Descriptor>
              Note: If you do not have an API key, please contact us to get your
              key
            </Text.Descriptor>
            <SActionsWrapper>
              <Button onClick={onClose} buttonStyle="secondary" type="button">
                Cancel
              </Button>
              <Button type="submit" buttonStyle="primary">
                Connect
              </Button>
            </SActionsWrapper>
          </Form.Provider>
        </FormContext>
      </SWrapper>
    );
  };
