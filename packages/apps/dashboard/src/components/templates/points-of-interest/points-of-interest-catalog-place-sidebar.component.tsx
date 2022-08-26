import { AttractionPlace } from '@hm/sdk';
import { Button, Link, Text, toast } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { PointsOfInterestPlaceLabels } from '@src/components/organisms';
import { Form } from '@src/components/templates';
import { usePointsOfInterestStore } from '@src/store';
import { fileToBase64 } from '@src/util/file';
import { validationResolver } from '@src/util/form';
import { validateUrl } from '@src/util/validations';
import React, { useCallback, useEffect, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as z from 'zod';

const SFormContentWrapper = styled.div`
  display: grid;
  grid-gap: 20px;
`;

const SActionsWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1;
  background: ${(props) => props.theme.colors.white};
  margin: 0 -24px;

  padding: 24px;
  padding-bottom: 8px;
`;

const SCloseButton = styled(Text.Body)`
  cursor: pointer;
  user-select: none;
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  width: max-content;
`;

const formSchema = z.object({
  name: z.string().nonempty('Please enter the name of the place'),
  description: z.string().max(500, 'Description is too long'),
  note: z.string().max(500, 'Note is too long').optional(),
  phone: z.string().optional(),
  website: z
    .string()
    .optional()
    .refine(validateUrl, 'Please enter a valid website'),
  address: z.string().nonempty('Please enter the address of the place'),
  requestBooking: z.boolean().optional(),
  photo: z.string().nonempty('Please upload a photo'),
});

type FormValues = z.infer<typeof formSchema>;

export const PointsOfInterestCatalogPlaceSidebar: React.FC = () => {
  const { sidebar, setSidebar, updatePlace } = usePointsOfInterestStore(
    useCallback(
      (state) => ({
        sidebar: state.pointsOfInterestPlaceSidebar,
        setSidebar: state.setPointsOfInterestPlaceSidebar,
        updatePlace: state.updatePointsOfInterestPlace,
      }),
      []
    )
  );

  const [editablePlace, setEditablePlace] = useState<
    AttractionPlace | undefined
  >(sidebar?.place);

  const [state, setState] = useState({ isNoteVisible: !!editablePlace?.note });

  const formMethods = useForm<FormValues>({
    defaultValues: {
      address: editablePlace?.address,
      description: editablePlace?.description || undefined,
      name: editablePlace?.name,
      note: editablePlace?.note || undefined,
      phone: editablePlace?.phone || undefined,
      photo: editablePlace?.photos[0],
      requestBooking: editablePlace?.requestBooking,
      website: editablePlace?.website || undefined,
    },
    validationContext: formSchema,
    validationResolver,
    submitFocusError: false,
  });

  useEffect(() => {
    formMethods.register('photo');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddNote = (): void => {
    setState((s) => ({ ...s, isNoteVisible: true }));
  };

  const handleClose = () => {
    setSidebar({
      visible: false,
    });
  };

  const handleImageUpload = async (file: File, setImage: () => void) => {
    formMethods.setValue('photo', await fileToBase64(file));
    setImage();
  };

  const handleSubmit = useCallback(
    (formValues: FormValues) => {
      if (!editablePlace) {
        return;
      }

      editablePlace.photos = [formValues.photo];

      const newEditablePlace = {
        ...editablePlace,
        ...formValues,
        photos: [formValues.photo],
      } as AttractionPlace;

      delete (newEditablePlace as unknown as Partial<FormValues>).photo;

      setImmediate(() => {
        toast.info(`Saved "${newEditablePlace.name}"`);
        updatePlace(newEditablePlace);
      });
    },
    [editablePlace, updatePlace]
  );

  return (
    <FormContext {...formMethods}>
      <Form.Provider
        gridGap={0}
        onSubmit={formMethods.handleSubmit(handleSubmit)}
      >
        <SActionsWrapper>
          <SCloseButton onClick={handleClose}>{'✕'}</SCloseButton>
          <Button buttonStyle="primary" type="submit">
            Save
          </Button>
        </SActionsWrapper>

        <SFormContentWrapper>
          <Inputs.Text
            name="name"
            embedded
            wrapperStyle={{ paddingLeft: 0 }}
            style={{ fontSize: 16 }}
          />

          {sidebar?.visible ? (
            <PointsOfInterestPlaceLabels
              onChange={(labels) => {
                setEditablePlace({ ...editablePlace!, ...{ labels } });
              }}
              placeLabels={editablePlace?.labels || []}
            />
          ) : null}

          <Inputs.Text
            name="description"
            placeholder="Explore Buckingham Palace Garden with unique access this summer, and discover for yourself its sights before enjoying a unique, once-in-a-lifetime opportunity to picnic with views of the Palace."
            multiLine
            label="Description"
            maxCharacters={500}
          />

          <Inputs.Text name="address" label="Address" />

          <Inputs.Text name="phone" label="Phone" />

          <Inputs.Text name="website" label="Website" />

          <Inputs.Checkbox name="requestBooking" sideLabel="Request Bookings" />

          <Inputs.File
            defaultValue={editablePlace?.photos[0]}
            compressImage
            acceptOnlyImages
            label="Photo"
            name="photo"
            onChange={handleImageUpload}
          />

          {!state.isNoteVisible ? (
            <Link onClick={handleAddNote}>Add Note +</Link>
          ) : (
            <Inputs.Text
              name="note"
              placeholder="Add a note (e.g. allergy information)"
              multiLine
              label="Note"
              maxCharacters={500}
            />
          )}
        </SFormContentWrapper>
      </Form.Provider>
    </FormContext>
  );
};
