import { CreateProductMutationVariables, Product } from '@hm/sdk';
import { Button, Grid, toast } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { Form } from '@src/components/templates';
import { validationResolver } from '@src/util/form';
import { format } from '@src/util/format';
import { sdk } from '@src/xhr/graphql-request';
import React, { useEffect, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { SpaceProps } from 'styled-system';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().nonempty('Name must be provided'),
  code: z.string().nonempty('Code must be provided'),
  stock: z
    .string()
    .nonempty('Stock must be provided')
    .transform((stock) => parseInt(stock)),
  costPrice: z
    .string()
    .nonempty('Cost price must be provided')
    .transform((costPrice) => format.getNumber(costPrice)),
  sellPrice: z
    .string()
    .nonempty('Sell price must be provided')
    .transform((sellPrice) => format.getNumber(sellPrice)),
});

type FormValues = z.infer<typeof formSchema>;

interface Props extends SpaceProps {
  defaultValues?: Product;
  onClose: () => void;
}

export const ProductsForm: React.FC<Props> = ({ defaultValues, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const formMethods = useForm<FormValues>({
    defaultValues,
    validationResolver,
    validationContext: formSchema,
  });

  const handleSubmit = async (formValues: FormValues) => {
    setLoading(true);
    if (!defaultValues) {
      try {
        await sdk.createProduct(formValues as CreateProductMutationVariables);
        formMethods.reset();
        toast.info('Product created successfully');
        onClose();
      } catch {
        toast.info('Unable to create');
      }
    } else {
      try {
        await sdk.updateProduct({
          where: { id: defaultValues.id },
          data: formValues,
        });
        formMethods.reset();
        toast.info('Product updated successfully');
        onClose();
      } catch {
        toast.info('Unable to update');
      }
    }

    setLoading(false);
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      await sdk.deleteProduct({ where: { id: defaultValues?.id! } });
      toast.warn('Product succesfully deleted');
      onClose();
    } catch {
      toast.warn('Unable to delete');
    }

    setLoading(false);
  };

  return (
    <FormContext {...formMethods}>
      <Form.Provider onSubmit={formMethods.handleSubmit(handleSubmit)}>
        <Inputs.Text name="name" label="Name" placeholder="Micro wave oven" />
        <Inputs.Text name="code" label="Code" placeholder="SE-1200" />
        <Inputs.Text name="stock" label="Stock" placeholder="200" />
        <Inputs.Text
          type="currency"
          name="costPrice"
          label="Cost Price"
          placeholder="300"
        />
        <Inputs.Text
          type="currency"
          name="sellPrice"
          label="Sell Price"
          placeholder="300"
        />
        <Grid justifyContent="flex-end" gridAutoFlow="column" gridGap="8px">
          {defaultValues ? (
            <Button
              loading={loading}
              onClick={onDelete}
              type="button"
              buttonStyle="delete"
            >
              Delete
            </Button>
          ) : null}

          <Button loading={loading} type="submit" buttonStyle="primary">
            {defaultValues ? 'Update' : 'Add'} product
          </Button>
        </Grid>
      </Form.Provider>
    </FormContext>
  );
};
