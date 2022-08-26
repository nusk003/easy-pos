import { Customer, Product } from '@hm/sdk';
import { Button, Grid, Text, toast } from '@src/components/atoms';
import { Inputs, Table } from '@src/components/molecules';
import { Form, Header } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { validationResolver } from '@src/util/form';
import { sdk } from '@src/xhr/graphql-request';
import _ from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { FormContext, useFieldArray, useForm } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import styled from 'styled-components';
import { v4 } from 'uuid';
import * as z from 'zod';
import dayjs from 'dayjs';

const SWrapper = styled.div`
  padding: 16px;
`;

const itemSchema = z.object({
  productId: z.string().nonempty(),
  title: z.string().nonempty(),
  quantity: z
    .number()
    .positive('Enter valid quantity')
    .or(z.string())
    .transform((qty) => {
      if (typeof qty === 'string') {
        return parseInt(qty);
      }
      return qty;
    }),
  availableStock: z.number().optional(),
  costPrice: z
    .string()
    .nonempty()
    .or(z.number())
    .transform((val) => {
      if (typeof val === 'string') {
        return parseFloat(val);
      }
      return val;
    }),
  sellPrice: z
    .string()
    .nonempty()
    .or(z.number())
    .transform((val) => {
      if (typeof val === 'string') {
        return parseFloat(val);
      }
      return val;
    }),
});

const formSchema = z.object({
  customerNIC: z
    .string()
    .nonempty('Please select the customer')
    .or(z.undefined())
    .refine((customerId) => {
      if (!customerId) {
        return false;
      }
      return true;
    }, 'Please select the customer'),
  items: z.array(itemSchema),
  instalmentPlan: z.object({
    initialPayment: z
      .string()
      .nonempty('Initial payment must be provided')
      .or(z.number())
      .transform((val) => {
        if (typeof val === 'string') {
          return parseFloat(val);
        }
        return val;
      }),
    noTerms: z
      .string()
      .nonempty('No of terms must be provided')
      .or(z.number())
      .transform((val) => {
        if (typeof val === 'string') {
          return parseInt(val);
        }
        return val;
      }),
  }),
});

export type SalesCreateFormValues = z.infer<typeof formSchema>;

export const SalesCreate = () => {
  const formMethods = useForm<SalesCreateFormValues>({
    defaultValues: {
      items: [],
    },
    validationContext: formSchema,
    validationResolver: validationResolver,
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const { fields, append, remove } = useFieldArray({
    control: formMethods.control,
    name: 'items',
  });

  const watchFormValues = formMethods.watch() as any;

  const calculateSubTotal = useCallback(() => {
    let subTotal = 0;
    fields?.forEach((field, index) => {
      const sellPrice = parseFloat(
        watchFormValues[`items[${index}].sellPrice`] as string
      );
      const qty = parseFloat(
        watchFormValues[`items[${index}].quantity`] as string
      );

      subTotal += sellPrice * qty;
    });

    return subTotal;
  }, [fields, watchFormValues]);

  const subTotal = calculateSubTotal();

  const totalPrice =
    parseFloat(subTotal as unknown as string) +
    (parseFloat(formMethods.watch('deliveryCharge') as unknown as string) || 0);

  const amountPerTerm = useMemo(() => {
    const initialPayment = parseFloat(
      watchFormValues['instalmentPlan.initialPayment']
    );
    const noTerms = parseInt(watchFormValues['instalmentPlan.noTerms']);

    return (subTotal - initialPayment) / noTerms;
  }, [watchFormValues]);

  const onSubmit = async (formValues: SalesCreateFormValues) => {
    const terms = [...Array(formValues.instalmentPlan.noTerms).keys()].map(
      (no, index) => {
        return {
          id: v4(),
          dueDate: dayjs()
            .add((index + 1) * 30, 'days')
            .startOf('day')
            .toDate(),
          dueAmount: amountPerTerm,
          paidAmount: 0,
        };
      }
    );

    const payload = {
      ...formValues,
      items: formValues.items.map((item) => {
        const totalCost = item.costPrice * item.quantity;
        const totalSell = item.sellPrice * item.quantity;
        delete (item as any).costPrice;
        delete (item as any).sellPrice;
        delete (item as any).availableStock;
        return {
          ...item,
          id: v4(),
          totalCost,
          totalSell,
        };
      }),
      instalmentPlan: {
        ...formValues.instalmentPlan,
        terms,
      },
      totalPrice: subTotal,
      subtotal: subTotal,
    };

    const toastId = toast.loader('Creating sale...');

    try {
      await sdk.createSale(payload as any);
      toast.update(toastId, 'Sale successfully created');
      formMethods.reset();
    } catch (error) {
      toast.update(toastId, 'Unable to create sale');
    }
  };

  const handleCustomerSearch = _.debounce(
    useCallback(async (query) => {
      const {
        searchCustomers: { data },
      } = await sdk.searchCustomers({ query, limit: 5 });
      setCustomers([...data]);
    }, []),
    200
  );

  const handleProductSearch = _.debounce(
    useCallback(async (query) => {
      const {
        searchProducts: { data },
      } = await sdk.searchProducts({ query, limit: 5 });
      setProducts([...data]);
    }, []),
    200
  );

  return (
    <>
      <Header title="Create sale" />
      <SWrapper>
        <FormContext {...formMethods}>
          <Form.Provider onSubmit={formMethods.handleSubmit(onSubmit)}>
            <Inputs.Search
              onChange={(e) => handleCustomerSearch(e.currentTarget.value)}
              name="customerNIC"
              key="customer"
              placeholder="Search customer"
              data={
                customers?.map(({ nic, firstName, lastName }) => ({
                  payload: nic,
                  title: `${firstName} ${lastName}`,
                })) || []
              }
              onClick={({ payload }) => {
                formMethods.setValue('customerNIC', payload);
              }}
            />
            <Inputs.Search
              name="productId"
              key="product"
              placeholder="Search product"
              onChange={(e) => handleProductSearch(e.currentTarget.value)}
              data={
                products?.map(({ id, name }) => ({
                  payload: name,
                  title: name,
                })) || []
              }
              onClick={({ payload }) => {
                const product = products.find(({ name }) => name === payload);
                formMethods.setValue('productId', name);

                append({
                  productId: product?.id,
                  availableStock: product?.stock,
                  quantity: 1,
                  costPrice: product?.costPrice.toString(),
                  sellPrice: product?.sellPrice.toString(),
                  title: product?.name,
                });
              }}
            />
            <Table.Provider>
              <Table.Header justifyContent="space-between">
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Qty</Table.HeaderCell>
                <Table.HeaderCell>Cost Price</Table.HeaderCell>
                <Table.HeaderCell>Sell Price</Table.HeaderCell>
              </Table.Header>
              <Table.Body>
                {fields.map((field, index) => {
                  const stock = field.availableStock as number;
                  const isStockAvailable = stock > 0;
                  return (
                    <Table.Row key={field.id}>
                      <Table.Cell>
                        <Inputs.Text
                          name={`items[${index}].title`}
                          defaultValue={field.title}
                          width="max-content"
                        />
                        <Inputs.Text
                          name={`items[${index}].productId`}
                          defaultValue={field.productId}
                          hidden
                        />
                      </Table.Cell>

                      <Table.Cell>
                        <Inputs.Text
                          key={`qty-${index}`}
                          type="number"
                          width="max-content"
                          textAlign="center"
                          name={`items[${index}].quantity`}
                          defaultValue={field.quantity}
                        />

                        <Text.BodyBold
                          mt="4px"
                          color={
                            isStockAvailable
                              ? theme.textColors.green
                              : theme.textColors.red
                          }
                        >
                          {isStockAvailable
                            ? `Availabe stock is ${stock}`
                            : 'Out of stock'}
                        </Text.BodyBold>
                      </Table.Cell>
                      <Table.Cell>
                        <Inputs.Text
                          key={`costPrice-${index}`}
                          type="number"
                          name={`items[${index}].costPrice`}
                          defaultValue={field.costPrice}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Inputs.Text
                          key={`sellPrice-${index}`}
                          type="number"
                          name={`items[${index}].sellPrice`}
                          defaultValue={field.sellPrice}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <FaTrash
                          style={{ cursor: 'pointer' }}
                          onClick={() => remove(index)}
                        />
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.FooterCell
                    style={{ marginTop: 16 }}
                    title="Total price"
                  >
                    <Grid gridAutoFlow="column" gridGap="16px">
                      <Inputs.Text
                        name="instalmentPlan.initialPayment"
                        label="Initial payment"
                        placeholder="Initial payment"
                      />
                      <Inputs.Text
                        name="instalmentPlan.noTerms"
                        label="No of terms"
                        placeholder="No of terms"
                      />
                    </Grid>
                  </Table.FooterCell>
                </Table.Row>
                <Table.FooterCell>Total price: {subTotal}</Table.FooterCell>
                <Table.FooterCell>
                  Amount per term: {amountPerTerm}
                </Table.FooterCell>
              </Table.Footer>
            </Table.Provider>
            <Button type="submit" buttonStyle="primary">
              Create sale
            </Button>
          </Form.Provider>
        </FormContext>
      </SWrapper>
    </>
  );
};
