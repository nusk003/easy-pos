import { Button, Text, toast } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { Form } from '@src/components/templates';
import { usePricelistStore } from '@src/store';
import { validationResolver } from '@src/util/form';
import React, { useCallback } from 'react';
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
  name: z.string().nonempty('Please enter the name of the category'),
  description: z.string().max(500, 'Description is too long'),
});

type FormValues = z.infer<typeof formSchema>;

export const PricelistsCatalogCategorySidebar: React.FC = () => {
  const { sidebar, setSidebar, updateCategory } = usePricelistStore(
    useCallback(
      (state) => ({
        sidebar: state.pricelistsCategorySidebar,
        setSidebar: state.setPricelistsCategorySidebar,
        updateCategory: state.updatePricelistsCategory,
      }),
      []
    )
  );

  const editableCategory = sidebar?.category;

  const formMethods = useForm<FormValues>({
    defaultValues: {
      name: editableCategory?.name,
      description: editableCategory?.description || undefined,
    },
    validationContext: formSchema,
    validationResolver,
    submitFocusError: false,
  });

  const handleClose = () => {
    setSidebar({
      visible: false,
    });
  };

  const handleSubmit = useCallback(
    (formValues: FormValues) => {
      if (!editableCategory?.id) {
        return;
      }

      updateCategory({
        ...editableCategory,
        name: formValues.name,
        description: formValues.description,
      });

      toast.info(`Saved "${formValues.name}"`);
    },
    [editableCategory, updateCategory]
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

        <SFormContentWrapper key={editableCategory?.id}>
          <Inputs.Text
            name="name"
            embedded
            wrapperStyle={{ paddingLeft: 0 }}
            style={{ fontSize: 16 }}
          />

          <Inputs.Text
            name="description"
            placeholder="Explore Buckingham Palace Garden with unique access this summer, and discover for yourself its sights before enjoying a unique, once-in-a-lifetime opportunity to picnic with views of the Palace."
            multiLine
            label="Description"
            maxCharacters={500}
          />
        </SFormContentWrapper>
      </Form.Provider>
    </FormContext>
  );
};
