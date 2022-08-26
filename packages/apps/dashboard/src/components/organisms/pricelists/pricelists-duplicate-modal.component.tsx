import { Link, Text } from '@src/components/atoms';
import { Inputs, Modal } from '@src/components/molecules';
import { Form } from '@src/components/templates';
import { validationResolver } from '@src/util/form';
import { useSpaces } from '@src/xhr/query';
import React, { useEffect } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import * as z from 'zod';

interface Props {
  onClose: () => void;
  visible: boolean;
  onSubmit: (name: string, spaceId: string) => void;
}

const formSchema = z.object({
  name: z.string().nonempty(),
  spaceId: z.string().nonempty(),
});

type FormValues = z.infer<typeof formSchema>;

export const PricelistsDuplicateModal: React.FC<Props> = ({
  onClose,
  visible,
  onSubmit,
}) => {
  const history = useHistory();

  const { data: spaces } = useSpaces();

  const formMethods = useForm<FormValues>({
    validationContext: formSchema,
    validationResolver,
  });

  const handleSubmit = (formValues: FormValues) => {
    onSubmit(formValues.name, formValues.spaceId);
  };

  useEffect(() => {
    if (!visible) {
      formMethods.setValue('name', '');
    }
  }, [formMethods, visible]);

  const spaceSelect =
    spaces?.map((space) => ({ label: space.name, value: space.id })) || [];

  return (
    <Modal onClose={onClose} visible={visible}>
      <Form.ModalWrapper>
        <FormContext {...formMethods}>
          <Form.Provider onSubmit={formMethods.handleSubmit(handleSubmit)}>
            <Text.Primary fontWeight="semibold">Duplicate menu</Text.Primary>
            <div>
              <Text.Body fontWeight="medium">Space</Text.Body>
              <Text.Descriptor mt="4px" mb="8px">
                Choose which space to add this menu to.
              </Text.Descriptor>
              <Inputs.Select name="spaceId" items={spaceSelect} />
              <Link
                mt="8px"
                onClick={() =>
                  history.push('/manage/spaces/space', {
                    redirect: '/pricelists',
                  })
                }
              >
                Add a new space +
              </Link>
            </div>
            <Inputs.Text name="name" label="Enter the name of the new menu" />
            <Form.Submit onCancel={onClose}>Duplicate</Form.Submit>
          </Form.Provider>
        </FormContext>
      </Form.ModalWrapper>
    </Modal>
  );
};
