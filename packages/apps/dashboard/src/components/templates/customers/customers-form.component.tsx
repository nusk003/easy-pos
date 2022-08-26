import {
  CreateCustomerMutationVariables,
  CreateProductMutationVariables,
  Customer,
  Product,
} from '@hm/sdk';
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
  firstName: z.string().nonempty('First name must be provided'),
  lastName: z.string().nonempty('Last name must be provided'),
  nic: z.string().nonempty('NIC must be provided'),
  phone: z.string().nonempty('Phone must be provided'),
  address: z.string().nonempty('Address must be provided'),
});

type FormValues = z.infer<typeof formSchema>;

interface Props extends SpaceProps {
  defaultValues?: Customer;
  onClose: () => void;
}

export const CustomersForm: React.FC<Props> = ({ defaultValues, onClose }) => {
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
        await sdk.createCustomer(formValues as CreateCustomerMutationVariables);
        formMethods.reset();
        toast.info('Customer created successfully');
        onClose();
      } catch {
        toast.info('Unable to create');
      }
    } else {
      try {
        await sdk.updateCustomer({
          where: { id: defaultValues.id },
          data: formValues,
        });
        formMethods.reset();
        toast.info('Customer updated successfully');
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
      await sdk.deleteCustomer({ where: { id: defaultValues?.id! } });
      toast.warn('Customer succesfully deleted');
      onClose();
    } catch {
      toast.warn('Unable to delete');
    }

    setLoading(false);
  };

  return (
    <FormContext {...formMethods}>
      <Form.Provider onSubmit={formMethods.handleSubmit(handleSubmit)}>
        <Inputs.Text name="firstName" label="First Name" placeholder="John" />
        <Inputs.Text name="lastName" label="Last Name" placeholder="Doe" />
        <Inputs.Text name="nic" label="NIC No" placeholder="123456789X" />
        <Inputs.Text name="phone" label="Phone" placeholder="+947XXXXXXXX" />
        <Inputs.Text
          name="address"
          label="Address"
          placeholder="123, Main road, Kandy"
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
            {defaultValues ? 'Update' : 'Add'} customer
          </Button>
        </Grid>
      </Form.Provider>
    </FormContext>
  );
};
