import { Text } from '@src/components/atoms';
import { Inputs, Modal } from '@src/components/molecules';
import { Form } from '@src/components/templates';
import { validationResolver } from '@src/util/form';
import React, { useEffect } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import * as z from 'zod';

interface Props {
  onClose: () => void;
  visible: boolean;
  onSubmit: (name: string) => void;
}

const formSchema = z.object({
  name: z.string().nonempty(),
});

type FormValues = z.infer<typeof formSchema>;

export const ManageSpacesDuplicateModal: React.FC<Props> = ({
  onClose,
  visible,
  onSubmit,
}) => {
  const formMethods = useForm<FormValues>({
    validationContext: formSchema,
    validationResolver,
  });

  const handleSubmit = (formValues: FormValues) => {
    onSubmit(formValues.name);
  };

  useEffect(() => {
    if (!visible) {
      formMethods.setValue('name', '');
    }
  }, [formMethods, visible]);

  return (
    <Modal onClose={onClose} visible={visible}>
      <Form.ModalWrapper>
        <FormContext {...formMethods}>
          <Form.Provider onSubmit={formMethods.handleSubmit(handleSubmit)}>
            <div>
              <Text.Primary fontWeight="semibold">Duplicate space</Text.Primary>
              <Text.Descriptor mt="4px">
                Duplicating a space will not duplicate any pricelists
              </Text.Descriptor>
            </div>
            <Inputs.Text name="name" label="Enter the name of the new space" />
            <Form.Submit onCancel={onClose}>Duplicate</Form.Submit>
          </Form.Provider>
        </FormContext>
      </Form.ModalWrapper>
    </Modal>
  );
};
