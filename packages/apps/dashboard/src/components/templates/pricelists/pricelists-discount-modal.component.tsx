import {
  Pricelist,
  PricelistDeliveryType,
  PricelistDiscount,
  PricelistMultiplierType,
  PricelistDiscountLevel,
  OmnivoreDiscountsResponse,
} from '@hm/sdk';
import { Link, Text, toast } from '@src/components/atoms';
import { Inputs, Modal } from '@src/components/molecules';
import { Form } from '@src/components/templates';
import { usePricelistStore } from '@src/store';
import { validationResolver } from '@src/util/form';
import { format } from '@src/util/format';
import { sdk } from '@src/xhr/graphql-request';
import { useOmnivoreDiscounts, useSpaces } from '@src/xhr/query';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import * as z from 'zod';

const SGrid = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  align-items: flex-end;
  gap: 16px 32px;
`;

const SFormSection = styled.div``;

const formSchema = z
  .object({
    pricelistId: z.string().optional(),
    name: z.string().nonempty('Please enter a name for the discount'),
    value: z.string().nonempty('Please enter a value for the discount'),
    roomService: z.boolean().optional(),
    tableService: z.boolean().optional(),
    open: z.boolean().optional(),
    posId: z.string().optional(),
    type: z.nativeEnum(PricelistMultiplierType),
    minAmount: z.number().or(z.undefined()).nullable(),
    minPercent: z.number().or(z.undefined()).nullable(),
    maxAmount: z.number().or(z.undefined()).nullable(),
    maxPercent: z.number().or(z.undefined()).nullable(),
    minOrderAmount: z
      .string()
      .nullable()
      .transform((minOrderAmount) =>
        minOrderAmount ? format.getNumber(minOrderAmount) : undefined
      ),
  })
  .refine(({ value, maxAmount, minAmount, maxPercent, minPercent, type }) => {
    if (
      type === PricelistMultiplierType.Percentage &&
      maxPercent &&
      minPercent &&
      (format.getNumber(value) > maxPercent ||
        format.getNumber(value) < minPercent)
    ) {
      toast.warn(
        `Percentage must be between ${format.percentage(
          minPercent
        )} and ${format.percentage(maxPercent)}`
      );
      return false;
    }

    if (
      type === PricelistMultiplierType.Absolute &&
      maxAmount &&
      minAmount &&
      (Number(value) > maxAmount || Number(value) < minAmount)
    ) {
      toast.warn(
        `Amount must be between ${format.percentage(
          minAmount
        )} and ${format.percentage(maxAmount)}`
      );
      return false;
    }

    return true;
  }, 'Invalid value');

type FormValues = z.infer<typeof formSchema>;

interface Props {
  level?: PricelistDiscountLevel;
  pricelist?: Pricelist;
  defaultValues?: PricelistDiscount;
  visible: boolean;
  onClose: () => void;
}

export const PricelistsDiscountModal: React.FC<Props> = ({
  pricelist,
  visible,
  defaultValues,
  onClose,
  level = PricelistDiscountLevel.Order,
}) => {
  const history = useHistory();

  const {
    pricelistsItemDiscount,
    setPricelistsItemDiscount,
    setPricelistsItemSidebar,
    pricelistsItemSidebar,
  } = usePricelistStore(
    useCallback(
      ({
        updatePricelistsItem,
        pricelistsItemDiscount,
        setPricelistsItemDiscount,
        setPricelistsItemSidebar,
        pricelistsItemSidebar,
      }) => ({
        updatePricelistsItem,
        pricelistsItemDiscount,
        setPricelistsItemDiscount,
        setPricelistsItemSidebar,
        pricelistsItemSidebar,
      }),
      []
    )
  );

  const { data: spaces, mutate: mutateSpaces } = useSpaces();

  const [submitLoading, setSubmitLoading] = useState(false);

  const itemLevel = level === PricelistDiscountLevel.Item;

  const formMethods = useForm<FormValues>({
    validationResolver,
    validationContext: formSchema,
  });

  const pricelists = useMemo(
    () =>
      spaces?.flatMap((space) => {
        return space.pricelists;
      }),
    [spaces]
  );

  const pricelistsSelect = useMemo(
    () =>
      pricelists
        ?.filter((pricelist) => !pricelist.promotions?.discounts)
        ?.map((pricelist) => ({
          label: pricelist.name,
          value: pricelist.id,
        })) || [],
    [pricelists]
  );

  const pricelistIdWatch = useMemo(
    () => formMethods.watch('pricelistId'),
    [formMethods]
  );

  const pricelistWatch = useMemo(
    () =>
      pricelists?.find(
        ({ id }) => id === pricelist?.id || id === pricelistIdWatch
      ),
    [pricelists, pricelistIdWatch, pricelist?.id]
  );

  const { data: allDiscounts } = useOmnivoreDiscounts(
    pricelistWatch?.posSettings?.posId
  );

  const discounts = allDiscounts?.filter((discount) =>
    level === PricelistDiscountLevel.Item ? discount.item : discount.order
  );

  const handleSubmit = useCallback(
    async (formValues: FormValues) => {
      const value =
        formValues.type === PricelistMultiplierType.Percentage
          ? format.getNumber(formValues.value) / 100
          : format.getNumber(formValues.value);

      const discount: PricelistDiscount = {
        id: defaultValues?.id || uuid(),
        posId: formValues.posId,
        name: formValues.name,
        value,
        count: defaultValues?.count || 0,
        delivery: [],
        type: formValues.type,
        minOrderAmount: formValues.minOrderAmount
          ? format.getNumber(String(formValues.minOrderAmount))
          : undefined,
        level,
        ...(formValues.posId && {
          posSettings: {
            open: formValues.open,
          },
        }),
      };

      if (formValues.roomService) {
        discount.delivery!.push({
          type: PricelistDeliveryType.Room,
          enabled: true,
        });
      }

      if (formValues.tableService) {
        discount.delivery!.push({
          type: PricelistDeliveryType.Table,
          enabled: true,
        });
      }

      if (
        itemLevel &&
        pricelistsItemDiscount?.item &&
        pricelistsItemDiscount?.category
      ) {
        const newItem = {
          ...pricelistsItemDiscount.item,
          promotions: { discounts: [discount] },
        };

        setPricelistsItemSidebar({ ...pricelistsItemSidebar, item: newItem });

        setPricelistsItemDiscount({
          ...pricelistsItemDiscount,
          visible: false,
          item: newItem,
        });

        return;
      }

      setSubmitLoading(true);

      const toastId = toast.loader('Creating discount');

      try {
        await sdk.updatePricelist({
          where: { id: pricelist?.id || formValues.pricelistId! },
          data: {
            promotions: { discounts: [discount] },
          },
        });

        await mutateSpaces();
        onClose();
        toast.update(toastId, 'Successfully created discount');
      } catch {
        toast.update(
          toastId,
          'Unable to add discount. Please try again later.'
        );
      }

      setSubmitLoading(false);
    },
    [
      defaultValues?.id,
      defaultValues?.count,
      level,
      itemLevel,
      pricelistsItemDiscount,
      setPricelistsItemSidebar,
      pricelistsItemSidebar,
      setPricelistsItemDiscount,
      pricelist?.id,
      mutateSpaces,
      onClose,
    ]
  );

  useEffect(() => {
    formMethods.register('open');
    formMethods.register('minAmount');
    formMethods.register('maxAmount');
    formMethods.register('minPercent');
    formMethods.register('maxPercent');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setDiscount = useCallback(
    (discount: OmnivoreDiscountsResponse | undefined) => {
      if (discount) {
        formMethods.setValue('posId', discount.posId);
        formMethods.setValue('value', discount.value.toString());
        formMethods.setValue('minAmount', discount.minAmount || null);
        formMethods.setValue('minPercent', discount.minPercent || null);
        formMethods.setValue('maxAmount', discount.maxAmount || null);
        formMethods.setValue('maxPercent', discount.maxPercent || null);
        formMethods.setValue('minOrderAmount', discount.minOrderAmount);
        formMethods.setValue('open', discount.open);

        formMethods.setValue(
          'type',
          undefined as unknown as PricelistMultiplierType
        );
        setImmediate(() => {
          formMethods.setValue('type', discount.type);
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const discount = allDiscounts?.filter((discount) =>
      level === PricelistDiscountLevel.Item ? discount.item : discount.order
    )?.[0];

    if (discount) {
      setDiscount(discount);
    }
  }, [allDiscounts, level, setDiscount]);

  const typeWatch = formMethods.watch('type');
  const openWatch = formMethods.watch('open');
  const minAmountWatch = formMethods.watch('minAmount');
  const maxAmountWatch = formMethods.watch('maxAmount');
  const minPercentWatch = formMethods.watch('minPercent');
  const maxPercentWatch = formMethods.watch('maxPercent');

  useEffect(() => {
    if (!visible) {
      setTimeout(() => {
        formMethods.setValue('pricelistId', '');
        formMethods.setValue('name', '');
        formMethods.setValue('posId', '');
        formMethods.setValue('value', '0');
        formMethods.setValue(
          'type',
          undefined as unknown as PricelistMultiplierType
        );
        formMethods.setValue('minAmount', null);
        formMethods.setValue('maxAmount', null);
        formMethods.setValue('minPercent', null);
        formMethods.setValue('maxPercent', null);
        formMethods.setValue('minOrderAmount', 0);
        formMethods.setValue('open', true);
      }, 300);
    } else {
      formMethods.setValue('pricelistId', pricelistsSelect?.[0]?.value);
      formMethods.setValue('name', defaultValues?.name || '');
      formMethods.setValue(
        'value',
        defaultValues?.type === PricelistMultiplierType.Percentage
          ? format.percentage(defaultValues?.value * 100 || '')
          : (defaultValues?.value || '').toString()
      );
      formMethods.setValue(
        'roomService',
        defaultValues?.delivery?.some(
          (d) => d.type === PricelistDeliveryType.Room && d.enabled
        )
      );
      formMethods.setValue(
        'tableService',
        defaultValues?.delivery?.some(
          (d) => d.type === PricelistDeliveryType.Table && d.enabled
        )
      );
      formMethods.setValue('posId', defaultValues?.posId);
      formMethods.setValue('minOrderAmount', defaultValues?.minOrderAmount);
      formMethods.setValue('open', defaultValues?.posSettings?.open || true);

      formMethods.setValue(
        'type',
        undefined as unknown as PricelistMultiplierType
      );
      setImmediate(() => {
        formMethods.setValue(
          'type',
          defaultValues?.type || PricelistMultiplierType.Absolute
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    const discount = allDiscounts?.filter(
      (discount) => discount.posId === defaultValues?.posId
    )?.[0];

    if (visible) {
      formMethods.setValue('minAmount', discount?.minAmount);
      formMethods.setValue('maxAmount', discount?.maxAmount);
      formMethods.setValue('minPercent', discount?.minPercent);
      formMethods.setValue('maxPercent', discount?.maxPercent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, allDiscounts, defaultValues?.posId]);

  return (
    <Modal visible={visible} onClose={onClose}>
      <Form.ModalWrapper style={{ maxWidth: 460 }}>
        <Text.Interactive>Create a new automatic discount</Text.Interactive>
        <FormContext {...formMethods}>
          <Form.Provider onSubmit={formMethods.handleSubmit(handleSubmit)}>
            {!pricelist && !itemLevel ? (
              <div>
                <Text.Body fontWeight="medium">Menu</Text.Body>
                <Text.Descriptor mt="4px">
                  {pricelistsSelect?.length
                    ? 'Choose which menu to add this discount to.'
                    : 'Each discount is linked to a menu (e.g. Main Menu), which must be created before adding a discount.'}
                </Text.Descriptor>
                <Text.Descriptor my="8px">
                  <Text.Descriptor fontWeight="semibold" as="span">
                    Note:{' '}
                  </Text.Descriptor>
                  You can only add 1 discount per pricelist
                </Text.Descriptor>
                {pricelistsSelect?.length ? (
                  <Inputs.Select name="pricelistId" items={pricelistsSelect} />
                ) : null}
                <Link mt="8px" onClick={() => history.push('/pricelists')}>
                  Add a menu +
                </Link>
              </div>
            ) : null}

            {(!defaultValues || itemLevel || pricelist) && discounts?.length ? (
              <Inputs.Select
                name="posId"
                onChange={(e) => {
                  const discount = discounts.find(
                    (d) => d.id === e.currentTarget.value
                  );
                  setDiscount(discount);
                }}
                items={discounts?.map((d) => ({
                  label: d.name,
                  value: d.posId!,
                }))}
                label="Discount"
              />
            ) : null}

            <Inputs.Text
              name="name"
              label="Discount Name"
              note="⌘ Guests will see this on the app so keep it short and sweet"
              placeholder="10% off when you order from the app"
            />

            <SGrid>
              <Inputs.Select
                name="type"
                disabled={!!pricelistWatch?.posSettings?.posId}
                label="Discount Type"
                items={[
                  PricelistMultiplierType.Absolute,
                  PricelistMultiplierType.Percentage,
                ]}
              />
              <SFormSection>
                <Inputs.Checkbox name="roomService" sideLabel="Room Service" />
                <Inputs.Checkbox
                  mt="8px"
                  name="tableService"
                  sideLabel="Table Service"
                />
              </SFormSection>

              <Inputs.Text
                autoComplete="off"
                disabled={!!pricelistWatch?.posSettings?.posId && !openWatch}
                note={
                  minPercentWatch ||
                  maxPercentWatch ||
                  minAmountWatch ||
                  maxAmountWatch
                    ? `Value should be between ${
                        typeWatch === PricelistMultiplierType.Percentage
                          ? format.percentage(minPercentWatch!)
                          : format.currency(minAmountWatch!)
                      } and ${
                        typeWatch === PricelistMultiplierType.Percentage
                          ? format.percentage(maxPercentWatch!)
                          : format.currency(maxAmountWatch!)
                      }`
                    : ''
                }
                label="Value"
                name="value"
                type={
                  typeWatch === PricelistMultiplierType.Absolute
                    ? 'currency'
                    : typeWatch === PricelistMultiplierType.Percentage
                    ? 'percentage'
                    : undefined
                }
                sideLabel="off order total"
                placeholder={
                  typeWatch === PricelistMultiplierType.Percentage
                    ? '10%'
                    : '10'
                }
                wrapperStyle={{
                  width: 150,
                }}
              />

              <Inputs.Text
                autoComplete="off"
                type={!typeWatch ? undefined : 'currency'}
                disabled={!!pricelistWatch?.posSettings?.posId}
                name="minOrderAmount"
                label="Minimum order total"
                placeholder={pricelistWatch?.posSettings?.posId ? '0' : '30'}
              />
            </SGrid>

            <Text.Descriptor>
              You can end this discount anytime on the discounts page.
            </Text.Descriptor>

            <Form.Submit loading={submitLoading} onCancel={onClose}>
              {defaultValues ? 'Update discount' : 'Add discount'}
            </Form.Submit>
          </Form.Provider>
        </FormContext>
      </Form.ModalWrapper>
    </Modal>
  );
};
