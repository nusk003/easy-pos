import { CreateAttractionMutationVariables } from '@hm/sdk';
import { Button, InfoTooltip, Text } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { Form } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { validationResolver } from '@src/util/form';
import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as z from 'zod';

const SWrapper = styled.div`
  width: 456px;
  padding: 32px;
`;

const SButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 32px;
`;

const SFormWrapper = styled.div`
  margin-top: 16px;
`;

const formSchema = z.object({
  description: z.string().max(500, 'Description is too long').optional(),
  requestBooking: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onNext: (formValues: PointsOfInterestSetupGeneralFormValues) => void;
}

export type PointsOfInterestSetupGeneralFormValues =
  CreateAttractionMutationVariables & FormValues;

export const PointsOfInterestSetupGeneral: React.FC<Props> = ({ onNext }) => {
  const onSubmit = (formValues: FormValues) => {
    onNext({
      enabled: true,
      description: formValues.description,
      requestBooking: formValues.requestBooking,
    });
  };

  const formMethods = useForm<FormValues>({
    validationContext: formSchema,
    validationResolver: validationResolver,
    submitFocusError: false,
  });

  return (
    <SWrapper>
      <Text.Heading>Setup Points of Interest</Text.Heading>
      <SFormWrapper>
        <FormContext {...formMethods}>
          <Form.Provider onSubmit={formMethods.handleSubmit(onSubmit)}>
            <Form.Section>
              <Inputs.Text
                name="description"
                label="Description"
                placeholder="Elah London sits in the heart of Central London, the crowning jewel of the fashionable Marylebone neighbourhood, with many fascinating places to visit right on our doorstep."
                multiLine
              />
            </Form.Section>
            <Form.Section>
              <Text.Body>Information and booking requests</Text.Body>
              <Text.Body color={theme.textColors.lightGray} mt="8px">
                Allow guests to request information or book via the messaging
                feature in the guest app.
              </Text.Body>
              <Inputs.Checkbox
                mt="16px"
                toggle
                name="requestBooking"
                defaultChecked
              />
            </Form.Section>
            <Form.Section>
              <InfoTooltip>
                This feature requires guest messaging to be set up. You may also
                turn this on or off later.
              </InfoTooltip>
              <SButtonWrapper>
                <Button buttonStyle="primary" type="submit">
                  Search →
                </Button>
              </SButtonWrapper>
            </Form.Section>
          </Form.Provider>
        </FormContext>
      </SFormWrapper>
    </SWrapper>
  );
};
