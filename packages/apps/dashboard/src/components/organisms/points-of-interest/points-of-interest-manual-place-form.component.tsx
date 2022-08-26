import { Text } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { Form } from '@src/components/templates';
import { usePointsOfInterestStore } from '@src/store';
import { fileToBase64 } from '@src/util/file';
import { validationResolver } from '@src/util/form';
import React, { useCallback, useEffect } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().nonempty('Please enter the name of the place'),
  address: z.string().nonempty('Please enter the address of the place'),
  photo: z.string().nonempty('Please upload a photo'),
});

type FormValues = z.infer<typeof formSchema>;

export const PointsOfInterestManualPlaceForm: React.FC = () => {
  const { createPlaceModal, setModal, createPlace } = usePointsOfInterestStore(
    useCallback(
      (state) => ({
        createPlaceModal: state.pointsOfInterestCreatePlaceModal,
        setModal: state.setPointsOfInterestCreatePlaceModal,
        createPlace: state.createPointsOfInterestPlace,
      }),
      []
    )
  );

  const formMethods = useForm<FormValues>({
    defaultValues: {
      name: createPlaceModal?.placeName,
      photo: '',
    },
    validationContext: formSchema,
    validationResolver,
  });

  useEffect(() => {
    formMethods.register('photo');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = useCallback(
    (formValues: FormValues) => {
      setImmediate(() => {
        createPlace({
          name: formValues.name,
          address: formValues.address,
          photos: [formValues.photo],
          id: uuid(),
        });
        setModal({ visible: false, isAddManualPlaceVisible: true });

        setTimeout(() => {
          setModal(undefined);
        }, 300);
      });
    },
    [createPlace, setModal]
  );

  const handleImageUpload = async (file: File, setImage: () => void) => {
    formMethods.setValue('photo', await fileToBase64(file));
    setImage();
  };

  const handleClose = () => {
    setModal({ visible: false, isAddManualPlaceVisible: true });

    setTimeout(() => {
      setModal(undefined);
    }, 300);
  };

  return (
    <Form.ModalWrapper>
      <Text.Heading>Add custom place</Text.Heading>
      <FormContext {...formMethods}>
        <Form.Provider onSubmit={formMethods.handleSubmit(handleSubmit)}>
          <Inputs.Text name="name" label="Place Name" />
          <Inputs.Text name="address" label="Address" />
          <Inputs.File
            name="photo"
            label="Photo"
            onChange={handleImageUpload}
          />
          <Form.Submit onCancel={handleClose}>Add place</Form.Submit>
        </Form.Provider>
      </FormContext>
    </Form.ModalWrapper>
  );
};
