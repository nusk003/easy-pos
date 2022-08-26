import { Button, toast } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { Form } from '@src/components/templates';
import {
  __dev__,
  __mews_test_access_token__,
  __mews_test_client_token__,
} from '@src/constants';
import { validationResolver } from '@src/util/form';
import { sdk } from '@src/xhr/graphql-request';
import { useHotel } from '@src/xhr/query';
import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';
import * as z from 'zod';

const formSchema = z.object({
  accessToken: z.string().nonempty('Access token must be provided'),
  clientToken: z.string().nonempty('Client token must be provided'),
});

type ManageMarketplaceIntegrationModalConfigureFormMewsValues = z.infer<
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

export const ManageMarketplaceIntegrationModalConfigureFormMews: React.FC<Props> =
  ({ onClose, ...rest }) => {
    const { mutate: mutateHotel } = useHotel();

    const formMethods =
      useForm<ManageMarketplaceIntegrationModalConfigureFormMewsValues>({
        validationContext: formSchema,
        validationResolver,
        ...(__dev__ && {
          defaultValues: {
            clientToken: __mews_test_client_token__,
            accessToken: __mews_test_access_token__,
          },
        }),
      });

    const onSubmit = async (
      formValues: ManageMarketplaceIntegrationModalConfigureFormMewsValues
    ) => {
      const toastId = toast.loader('Configuring');

      try {
        await sdk.authorizeMews(formValues);
        await mutateHotel();
        toast.update(toastId, 'Successfully configured');
        onClose();
      } catch {
        toast.update(toastId, 'Unable to configure');
      }
    };

    return (
      <SWrapper {...rest}>
        <FormContext {...formMethods}>
          <Form.Provider onSubmit={formMethods.handleSubmit(onSubmit)}>
            <Inputs.Text
              name="clientToken"
              placeholder="Client token"
              label="Client token"
            />
            <Inputs.Text
              name="accessToken"
              placeholder="Access token"
              label="Access token"
              type="password"
            />
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
