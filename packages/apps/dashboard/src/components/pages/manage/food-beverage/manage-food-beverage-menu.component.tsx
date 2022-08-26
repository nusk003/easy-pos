import {
  CreatePricelistMutationVariables,
  IntegrationProvider,
  PayoutsStrategy,
  Pricelist,
  PricelistCollection,
  PricelistDelivery,
  PricelistDeliveryType,
  PricelistSurcharge,
  UpdatePricelistInput,
} from '@hm/sdk';
import { ReactComponent as IntegrationIcon } from '@src/assets/icons/integration.icon.svg';
import { ReactComponent as VerifiedIcon } from '@src/assets/icons/verified-rounded-icon.svg';
import {
  Badge,
  Grid,
  InfoTooltip,
  Link,
  Text,
  toast,
} from '@src/components/atoms';
import { Card, Inputs } from '@src/components/molecules';
import {
  FormInputs,
  ManageFoodBeverageSurchargeTile,
} from '@src/components/organisms';
import { availabilitySchema } from '@src/components/organisms/form-inputs/availability.component';
import {
  Form,
  Header,
  ManageFoodBeverageSurchargeModal,
  ManageFormSection,
  ManageFormWrapper,
} from '@src/components/templates';
import { theme } from '@src/components/theme';
import { __electron__ } from '@src/constants';
import { usePricelistStore } from '@src/store';
import { validationResolver } from '@src/util/form';
import { usePOSLocations } from '@src/util/integrations';
import { sdk } from '@src/xhr/graphql-request';
import { useHotel, useOmnivoreOptions, useSpaces } from '@src/xhr/query';
import { PrinterInfo } from 'electron';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormContext, useFieldArray, useForm } from 'react-hook-form';
import { AiFillDelete } from 'react-icons/ai';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components';
import * as z from 'zod';

declare const window: any;

const SFormSection = styled(Form.Provider).attrs({ as: 'div' })``;

const SManageFoodBeverageSurchargeTilesWrapper = styled.div`
  display: grid;
  gap: 8px;
`;

const SErrorText = styled(Text.Body)`
  color: ${theme.textColors.red};
  font-weight: 600;
`;

const SProcessItemWrapper = styled(Card).attrs({
  cardStyle: 'light-blue',
})`
  display: grid;
  grid-auto-flow: column;
  gap: 16px;
  align-items: center;
  justify-content: start;
`;

const SProcessWrapper = styled.div`
  display: grid;
  gap: 16px;
`;

const SDeleteButton = styled(AiFillDelete).attrs({
  fill: theme.textColors.blue,
})`
  cursor: pointer;
  user-select: none;
  width: min-content;
`;

const formSchema = z.object({
  spaceId: z.string().optional(),
  name: z.string().nonempty('Please enter a menu name'),
  description: z.string().max(500, 'Description is too long'),
  availability: availabilitySchema,
  commerce: z.boolean().optional(),
  enabledPayments: z
    .object({
      card: z.boolean().optional(),
      cash: z.boolean().optional(),
      roomBill: z.boolean().optional(),
    })
    .optional(),
  autoApprove: z.boolean().optional(),
  roomService: z.boolean().optional(),
  tableService: z.boolean().optional(),
  feedback: z.boolean().optional(),
  posSettings: z
    .object({
      enabled: z.boolean(),
      provider: z.nativeEnum(IntegrationProvider).nullish(),
      employeeId: z.string().nullish(),
      revenueCenterId: z.string().nullish(),
      tableService: z
        .object({
          posId: z.string().optional(),
          name: z.string(),
        })
        .nullish(),
      roomService: z
        .object({
          posId: z.string().optional(),
          name: z.string(),
        })
        .nullish(),
    })
    .or(z.undefined()),
  printers: z
    .array(
      z.object({
        name: z.string(),
        copies: z.string(),
      })
    )
    .optional(),
});

interface FormValues extends z.infer<typeof formSchema> {
  id?: string;
  spaceId?: string;
  'enabledPayments.card'?: boolean;
  'enabledPayments.cash'?: boolean;
  'enabledPayments.roomBill'?: boolean;
  delivery?: PricelistDelivery[];
  collection?: PricelistCollection[];
}

export const ManageFoodBeverageMenu: React.FC = () => {
  const history = useHistory();
  const { state } = useLocation<{ pricelist?: Pricelist }>();

  const [submitLoading, setSubmitLoading] = useState(false);
  const [surcharges, setSurcharges] = useState<PricelistSurcharge[]>([]);
  const [currentSurcharge, setCurrentSurcharge] =
    useState<PricelistSurcharge>();
  const [printers, setPrinters] = useState<Array<PrinterInfo>>([]);
  const [isSurchargeModalVisible, setIsSurchargeModalVisible] = useState(false);
  const posLocations = usePOSLocations();

  const { printers: defaultPrinters, setPricelistPrinters } = usePricelistStore(
    useCallback(
      (state) => ({
        printers: state.printers,
        setPricelistPrinters: state.setPricelistPrinters,
      }),
      []
    )
  );

  const { data: hotel } = useHotel();
  const { data: spaces, mutate: mutateSpaces } = useSpaces();

  const defaultValues = state?.pricelist;

  const defaultPricelistPrinters = defaultValues?.id
    ? defaultPrinters?.[defaultValues.id]?.map((p) => ({
        name: p.name,
        copies: String(p.copies),
      }))
    : [];

  const formMethods = useForm<FormValues>({
    defaultValues: {
      ...defaultValues,
      roomService: defaultValues?.delivery?.some(
        (d) => d.type === PricelistDeliveryType.Room && d.enabled
      ),
      tableService: defaultValues?.delivery?.some(
        (d) => d.type === PricelistDeliveryType.Table && d.enabled
      ),
      posSettings: {
        enabled: !!defaultValues?.posSettings?.provider,
        provider:
          defaultValues?.posSettings?.provider || posLocations?.[0]?.provider,
      },
      spaceId: defaultValues?.space.id,
      printers: defaultPricelistPrinters,
    } as FormValues,
    validationResolver,
    validationContext: formSchema,
  });

  const {
    fields: printerFields,
    append: appendPrinterFields,
    remove: removePrinterFields,
  } = useFieldArray({ name: 'printers', control: formMethods.control });

  useEffect(() => {
    if (defaultValues?.surcharges) {
      setSurcharges(defaultValues?.surcharges);
    }
  }, [defaultValues?.surcharges]);

  const handleAddSurcharge = (surcharge: PricelistSurcharge) => {
    const existingSurchargeIdx = surcharges.findIndex(
      (s) => s.id === surcharge.id
    );
    if (existingSurchargeIdx > -1) {
      setSurcharges((s) => {
        s[existingSurchargeIdx] = surcharge;
        return [...s];
      });
    } else {
      setSurcharges((s) => [...s, surcharge]);
    }
  };

  const handleEditSurcharge = (surcharge: PricelistSurcharge) => {
    setCurrentSurcharge(surcharge);
    setIsSurchargeModalVisible(true);
  };

  const handleDeleteSurcharge = (surcharge: PricelistSurcharge) => {
    setSurcharges((s) => s.filter(({ id }) => id !== surcharge.id));
  };

  const handleSubmit = async (formValues: FormValues) => {
    formValues.delivery = [];

    if (formValues.roomService) {
      formValues.delivery.push({
        enabled: true,
        type: PricelistDeliveryType.Room,
      });
    }

    if (formValues.tableService) {
      formValues.delivery.push({
        enabled: true,
        type: PricelistDeliveryType.Table,
      });
    }

    if (formValues.commerce) {
      if (
        !formValues.enabledPayments?.cash &&
        !formValues.enabledPayments?.card &&
        !formValues.enabledPayments?.roomBill
      ) {
        formMethods.setError(
          'enabledPayments',
          'Please select a payment method'
        );
        return;
      }

      if (!formValues.autoApprove) {
        delete formValues.autoApprove;
      }

      if (formValues.posSettings) {
        if (!formValues.posSettings.enabled) {
          delete formValues.posSettings;
        }

        const orderTypeTS = orderTypes?.find(
          ({ name }) => name === formValues.posSettings?.tableService?.name
        );

        const orderTypeRS = orderTypes?.find(
          ({ name }) => name === formValues.posSettings?.roomService?.name
        );

        const revenueCenter = revenueCenters?.find(
          ({ name }) => name === formValues.posSettings?.revenueCenterId
        );
        const employee = employees?.find(
          ({ name }) => name === formValues.posSettings?.employeeId
        );

        if (formValues.posSettings?.employeeId && employee) {
          formValues.posSettings.employeeId = employee.id;
        }

        if (formValues.posSettings?.tableService && orderTypeTS) {
          formValues.posSettings.tableService.posId = orderTypeTS.id;
        }

        if (formValues.posSettings?.roomService && orderTypeRS) {
          formValues.posSettings.roomService.posId = orderTypeRS.id;
        }

        if (formValues.posSettings?.revenueCenterId && revenueCenter) {
          formValues.posSettings.revenueCenterId = revenueCenter.id;
        }

        const pos = posLocations.find(
          ({ provider }) => provider === formValues.posSettings?.provider
        );
        if (formValues.posSettings && pos?.posId) {
          (
            formValues.posSettings as typeof formValues.posSettings & {
              posId: string;
            }
          ).posId = pos.posId;
        }
      }
    }

    const formValuesPrinters = formValues.printers;

    let pricelistId = defaultValues?.id;

    delete formValues.id;
    delete formValues.collection;
    delete formValues['enabledPayments.card'];
    delete formValues['enabledPayments.roomBill'];
    delete formValues['enabledPayments.cash'];
    delete formValues.roomService;
    delete formValues.tableService;
    delete formValues.printers;
    delete formValues.collection;

    const pricelistMutationVariables = {
      ...formValues,
      surcharges,
      ...(!defaultValues && { catalog: { categories: [] } }),
    };

    setSubmitLoading(true);

    let success = false;

    if (!defaultValues) {
      const toastId = toast.loader('Creating menu');

      try {
        const { createPricelist } = await sdk.createPricelist(
          pricelistMutationVariables as CreatePricelistMutationVariables
        );
        await mutateSpaces();

        toast.update(toastId, 'Successfully created menu');
        history.push(`/pricelists/${createPricelist.id}`, {
          pricelist: createPricelist as Pricelist,
        });
        pricelistId = createPricelist.id;
        success = true;
      } catch {
        toast.update(toastId, 'Unable to create menu');
      }
    } else {
      const toastId = toast.loader('Updating menu');

      try {
        await sdk.updatePricelist({
          where: { id: defaultValues.id! },
          data: pricelistMutationVariables as UpdatePricelistInput,
        });
        await mutateSpaces();

        toast.update(toastId, 'Successfully updated menu');
        success = true;
      } catch {
        toast.update(toastId, 'Unable to update menu');
      }

      await mutateSpaces();
    }

    if (success && __electron__) {
      setPricelistPrinters(
        pricelistId!,
        printers
          .filter((p) => formValuesPrinters?.some((fp) => fp.name === p.name))
          .map((p) => ({
            ...p,
            copies: Number(
              formValuesPrinters!.find((fp) => fp.name === p.name)!.copies
            ),
          }))
      );
    }

    setSubmitLoading(false);
  };

  const handleChangePaymentMethod = (_field: string, value: boolean) => {
    if (formMethods.errors.enabledPayments) {
      if (!value) {
        formMethods.clearError('enabledPayments');
      }
    }
  };

  const handleChangeCommerce = (value: boolean) => {
    if (formMethods.errors.enabledPayments) {
      if (value) {
        formMethods.clearError('enabledPayments');
      }
    }
  };

  const spaceSelect = useMemo(
    () =>
      spaces?.map((space) => ({ label: space.name, value: space.id })) || [],
    [spaces]
  );

  useEffect(() => {
    if (!__electron__) {
      return;
    }

    window.native.print.getPrinters();

    const getPrinters = async (message: MessageEvent) => {
      try {
        const { printers, topic } = JSON.parse(message.data);

        if (topic !== 'getPrintersResponse') {
          return;
        }

        setPrinters(printers);
        // eslint-disable-next-line no-empty
      } catch {}
    };

    window.addEventListener('message', getPrinters);

    return () => {
      window.removeEventListener('message', getPrinters);
    };
  }, []);

  const watchedCommerce =
    formMethods.watch('commerce') !== undefined
      ? formMethods.watch('commerce')
      : defaultValues?.commerce;

  const watchPosSettings = formMethods.watch('posSettings');

  const omnivoreLocationId = useMemo(() => {
    const posSettings = formMethods.getValues('posSettings');
    const pos = posLocations.find(
      ({ provider }) => provider === posSettings?.provider
    );

    return pos?.posId;
  }, [posLocations, formMethods]);

  const { data: omnivoreOptions } = useOmnivoreOptions(omnivoreLocationId);

  const orderTypes = omnivoreOptions?.orderTypes;
  const employees = omnivoreOptions?.employees;
  const revenueCenters = omnivoreOptions?.revenueCenters;

  const posSelect = useMemo(
    () => posLocations.map(({ provider }) => provider),
    [posLocations]
  );

  const orderTypesSelect = useMemo(
    () => (orderTypes || []).map(({ name }) => name),
    [orderTypes]
  );

  return (
    <>
      <FormContext {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
          <Header
            backgroundColor="#fafafa"
            title={defaultValues ? defaultValues.name : 'Add a menu'}
            primaryButton={
              defaultValues ? (
                <Form.Submit loading={submitLoading}>Save</Form.Submit>
              ) : null
            }
          />
          <ManageFormWrapper>
            <ManageFormSection
              title="General"
              description="Add general information about your menu"
            >
              <SFormSection>
                <div>
                  <Text.Body fontWeight="medium">Space</Text.Body>
                  <Text.Descriptor mt="4px" mb="8px">
                    {spaces?.length
                      ? 'Choose which space to add this menu to.'
                      : 'Each menu is linked to a space (e.g. your restaurant), which must be created before adding a menu.'}
                  </Text.Descriptor>
                  {spaces?.length ? (
                    <Inputs.Select name="spaceId" items={spaceSelect} />
                  ) : null}
                  <Link
                    mt="8px"
                    onClick={() =>
                      history.push('/manage/spaces/space', {
                        redirect: '/manage/food-beverage/menu',
                      })
                    }
                  >
                    Add a new space +
                  </Link>
                </div>
                {spaces?.length ? (
                  <>
                    <Inputs.Text
                      label="Name"
                      name="name"
                      placeholder="Main menu"
                    />
                    <Inputs.Text
                      label="Description"
                      placeholder="Regardless of whether you are after light refreshment or a full dining experience,  The Quarterdeck restaurant will appeal to all tastes and appetites. We aspire to make the most of our prime location in the Garden of England by using as much seasonal and local produce as possible."
                      name="description"
                      maxCharacters={500}
                      multiLine
                    />
                  </>
                ) : null}
              </SFormSection>
            </ManageFormSection>

            {spaces?.length ? (
              <>
                <ManageFormSection
                  title="Availability"
                  description="Add opening times to your menu"
                >
                  <SFormSection>
                    <div>
                      <Text.Body fontWeight="medium">Availability</Text.Body>
                      <Text.Descriptor mt="4px">
                        Guests will not be able to order outside opening times
                        but will have the option to pre-order.
                      </Text.Descriptor>
                    </div>
                    <FormInputs.Availability
                      defaultValues={defaultValues?.availability}
                    />
                  </SFormSection>
                </ManageFormSection>
                <ManageFormSection
                  title="Fulfilment"
                  description="Choose which ways in which an order can be fulfilled and completed"
                >
                  <SFormSection>
                    <div>
                      <Text.Body fontWeight="medium">Fulfilment</Text.Body>
                      <Text.Descriptor mt="4px">
                        Please select all the ways in which an order can be
                        fulfilled and completed
                      </Text.Descriptor>
                    </div>

                    <Grid gridGap="small">
                      <Inputs.Checkbox
                        name="roomService"
                        sideLabel="Room Service"
                      />
                      <Inputs.Checkbox
                        name="tableService"
                        sideLabel="Table Service"
                      />
                    </Grid>

                    <InfoTooltip>
                      More fulfilment methods will be available in the future,
                      such as guest collecting orders or turning up for bookings
                    </InfoTooltip>
                  </SFormSection>
                </ManageFormSection>
                <ManageFormSection
                  title="Commerce"
                  description="Allow guests to submit orders on the app and accept payments for this pricelist"
                >
                  <SFormSection>
                    <div>
                      <Text.Body fontWeight="medium">Commerce</Text.Body>
                      <Text.Descriptor mt="4px" mb="12px">
                        Enabling commerce allows guests to order from a
                        pricelist. You must select a payment method to use this
                        option.
                      </Text.Descriptor>
                      <Inputs.Checkbox
                        mb="16px"
                        name="commerce"
                        toggle
                        onClick={handleChangeCommerce}
                      />
                      <InfoTooltip>
                        Payments are currently enabled. Guests will be able to
                        view, browse and submit orders. This can be disabled
                        later.
                      </InfoTooltip>
                    </div>

                    {watchedCommerce ? (
                      <>
                        <div>
                          <Text.Body fontWeight="medium">
                            Payment Methods
                          </Text.Body>
                          <Text.Descriptor mt="4px">
                            Please select all the ways your guests can pay for
                            orders from this pricelist via the app.
                          </Text.Descriptor>
                        </div>

                        <Grid gridGap="small">
                          <Grid
                            gridAutoFlow="column"
                            gridTemplateColumns="max-content"
                            alignItems="center"
                            gridGap="16px"
                          >
                            <Inputs.Checkbox
                              disabled={
                                hotel?.payouts?.enabled ===
                                  PayoutsStrategy.Disabled ||
                                !hotel?.payouts?.enabled
                              }
                              name="enabledPayments.card"
                              onClick={(value) =>
                                handleChangePaymentMethod('card', value)
                              }
                            />
                            <div>
                              <Text.Body>Pay by card</Text.Body>
                              {!hotel?.payouts?.enabled ||
                              hotel?.payouts?.enabled ===
                                PayoutsStrategy.Disabled ? (
                                <Link
                                  onClick={() =>
                                    history.push('/manage/payments')
                                  }
                                >
                                  You have not activated Payments yet {'->'}
                                </Link>
                              ) : null}
                            </div>
                          </Grid>

                          <Inputs.Checkbox
                            name="enabledPayments.roomBill"
                            sideLabel="Add to room bill"
                            onClick={(value) =>
                              handleChangePaymentMethod('roomBill', value)
                            }
                          />

                          <Inputs.Checkbox
                            name="enabledPayments.cash"
                            sideLabel="Pay in person"
                            onClick={(value) =>
                              handleChangePaymentMethod('cash', value)
                            }
                          />
                          {formMethods.errors?.enabledPayments ? (
                            <SErrorText>
                              {formMethods.errors?.enabledPayments?.type}
                            </SErrorText>
                          ) : null}
                        </Grid>
                      </>
                    ) : null}
                  </SFormSection>
                </ManageFormSection>

                {watchedCommerce ? (
                  <>
                    <ManageFormSection
                      title="Surcharges"
                      description="Add percentage fees to orders from this menu"
                    >
                      <SFormSection>
                        <div>
                          <Text.Body fontWeight="medium">Surcharges</Text.Body>
                          <Text.Descriptor mt="4px">
                            Surcharges will be automatically applied to the
                            entire order when guests order from this pricelist
                          </Text.Descriptor>
                        </div>
                        {surcharges.length ? (
                          <SManageFoodBeverageSurchargeTilesWrapper>
                            {surcharges.map((surcharge) => (
                              <ManageFoodBeverageSurchargeTile
                                key={surcharge.id}
                                surcharge={surcharge}
                                onEdit={handleEditSurcharge}
                                onDelete={handleDeleteSurcharge}
                              />
                            ))}
                          </SManageFoodBeverageSurchargeTilesWrapper>
                        ) : null}
                        <Link
                          disableOnClick={false}
                          onClick={() => {
                            setCurrentSurcharge(undefined);
                            setIsSurchargeModalVisible(true);
                          }}
                        >
                          Add a surcharge +
                        </Link>
                      </SFormSection>
                    </ManageFormSection>

                    {!defaultValues || defaultValues.posSettings?.posId ? (
                      <ManageFormSection
                        title="Point of Sales"
                        description="Automatically receive guest orders to your POS"
                      >
                        <div>
                          <Grid
                            gridAutoFlow="column"
                            justifyContent="start"
                            alignItems="center"
                            gridGap="8px"
                          >
                            {posLocations.length ? (
                              <>
                                <VerifiedIcon fill={theme.colors.green} />
                                <Text.Body fontWeight="semibold">
                                  Your POS is connected
                                </Text.Body>
                              </>
                            ) : (
                              <>
                                <IntegrationIcon fill={theme.textColors.gray} />
                                <Text.Body fontWeight="semibold">
                                  You have not configured your POS yet
                                </Text.Body>
                              </>
                            )}
                          </Grid>
                          <Link
                            interactive
                            mt="8px"
                            onClick={() => history.push('/manage/marketplace')}
                          >
                            {posLocations.length ? 'Manage' : 'Connect'} your
                            POS {'->'}
                          </Link>
                        </div>

                        {posLocations.length && !defaultValues?.posSettings ? (
                          <Inputs.Checkbox
                            mt="8px"
                            name="posSettings.enabled"
                            toggle
                            boldSideLabel
                            sideLabel="Enable Point of Sales Integration"
                            sideLabelDescription="A more efficient way for staff to process orders"
                          />
                        ) : null}

                        {!posLocations.length ? (
                          <>
                            <Text.SmallHeading>How It Works</Text.SmallHeading>
                            <SProcessWrapper>
                              <SProcessItemWrapper>
                                <Badge count={1} bg="blue" />
                                <div>
                                  <Text.Interactive>
                                    Sync your menu items
                                  </Text.Interactive>
                                  <Text.Descriptor>
                                    Once connected to your POS, all menu items
                                    are fetched automatically to your Dashboard.
                                    Additional details can be added to each menu
                                    item such as images and descriptions.
                                  </Text.Descriptor>
                                </div>
                              </SProcessItemWrapper>

                              <SProcessItemWrapper>
                                <Badge count={2} bg="blue" />
                                <div>
                                  <Text.Interactive>
                                    Automate order processing
                                  </Text.Interactive>
                                  <Text.Descriptor>
                                    Orders made via the guest app will be sent
                                    automatically to your POS, each order is
                                    also synced to your Dashboard.
                                  </Text.Descriptor>
                                </div>
                              </SProcessItemWrapper>
                            </SProcessWrapper>
                          </>
                        ) : null}

                        {watchPosSettings?.enabled ||
                        defaultValues?.posSettings ? (
                          <>
                            <Inputs.Select
                              name="posSettings.provider"
                              items={posSelect}
                              disabled={!!defaultValues}
                              label={'POS Location'}
                              note={
                                posLocations?.length
                                  ? 'Select the location of your POS.'
                                  : 'Each menu is linked to a location which must be created before adding a menu.'
                              }
                            />

                            <Inputs.Select
                              name="posSettings.employeeId"
                              items={(employees || []).map(({ name }) => name)}
                              label="Employee"
                              note={
                                employees?.length
                                  ? 'Select which employee to link to each order. We recommend creating a new employee to manage orders created via an app.'
                                  : 'Each order is linked to a employee which must be created before adding a menu.'
                              }
                            />

                            <Inputs.Select
                              name="posSettings.roomService.name"
                              items={orderTypesSelect}
                              label="Room order type"
                              note={
                                orderTypes?.length
                                  ? 'Select an order type to link to orders fulfilled by room service.'
                                  : 'Each fulfilment option is linked to a order type which must be created before adding a menu.'
                              }
                            />

                            <Inputs.Select
                              name="posSettings.tableService.name"
                              items={orderTypesSelect}
                              label="Table order type"
                              note={
                                orderTypes?.length
                                  ? 'Select an order type to link to orders fulfilled by table service.'
                                  : 'Each fulfilment option is linked to a order type which must be created before adding a menu.'
                              }
                            />

                            <Inputs.Select
                              name="posSettings.revenueCenterId"
                              items={(revenueCenters || []).map(
                                ({ name }) => name
                              )}
                              label="Revenue center"
                              note={
                                orderTypes?.length
                                  ? 'Select an revenue center to link to orders.'
                                  : 'Each order is linked to a revenue center which must be created before adding a menu.'
                              }
                            />
                          </>
                        ) : null}
                      </ManageFormSection>
                    ) : null}

                    {__electron__ && printers.length ? (
                      <ManageFormSection
                        title="Printer"
                        description="Print tickets when orders are received"
                      >
                        <div>
                          <Text.Body fontWeight="medium">
                            Print orders
                          </Text.Body>
                          <Text.Descriptor mt="4px">
                            Automatically print orders on your ticket printer as
                            they are recieved on your Dashboard.
                          </Text.Descriptor>
                        </div>
                        <div>
                          <Grid
                            gridGap="12px"
                            gridTemplateColumns="auto auto min-content"
                            justifyContent="start"
                            alignItems="center"
                          >
                            {printerFields?.length ? (
                              <>
                                <Text.Body fontWeight="medium">Name</Text.Body>
                                <Text.Body fontWeight="medium">
                                  Copies
                                </Text.Body>
                                <div></div>
                              </>
                            ) : null}

                            {printerFields.map((p, idx) => (
                              <React.Fragment key={p.id}>
                                <Inputs.Select
                                  name={`printers[${idx}].name`}
                                  defaultValue={
                                    defaultPricelistPrinters?.[idx]?.name
                                  }
                                  items={printers.map((printer) => ({
                                    value: printer.name,
                                    label: printer.displayName,
                                  }))}
                                />

                                <Inputs.Select
                                  name={`printers[${idx}].copies`}
                                  defaultValue={
                                    defaultPricelistPrinters?.[idx]?.copies
                                  }
                                  items={[1, 2, 3, 4, 5]}
                                />

                                <SDeleteButton
                                  onClick={() => removePrinterFields(idx)}
                                />
                              </React.Fragment>
                            ))}
                          </Grid>
                        </div>
                        {printerFields.length < printers.length ? (
                          <Link
                            disableOnClick={false}
                            onClick={appendPrinterFields}
                          >
                            Add printer +
                          </Link>
                        ) : null}
                      </ManageFormSection>
                    ) : null}

                    <ManageFormSection
                      title="Feedback"
                      description="Collect feedback on orders"
                    >
                      <div>
                        <Text.Body fontWeight="medium">
                          Request Guest Reviews
                        </Text.Body>
                        <Text.Descriptor mt="4px">
                          Automatically follow up with guests via the guest app
                          to check if they were satisfied with their order.
                        </Text.Descriptor>
                      </div>
                      <Inputs.Checkbox mt="8px" name="feedback" toggle />
                    </ManageFormSection>

                    <ManageFormSection
                      title="Auto approve"
                      description="Automatically approve all incoming orders"
                    >
                      <div>
                        <Text.Body fontWeight="medium">Auto Approve</Text.Body>
                        <Text.Descriptor mt="4px">
                          We recommend enabling this option if you have POS
                          integration. Scheduled orders will still need to be
                          approved manually.
                        </Text.Descriptor>
                      </div>
                      <Inputs.Checkbox mt="8px" name="autoApprove" toggle />
                    </ManageFormSection>
                  </>
                ) : null}
                <Form.Submit loading={submitLoading}>
                  {defaultValues ? 'Save' : 'Add menu'}
                </Form.Submit>
              </>
            ) : null}
          </ManageFormWrapper>
        </form>
      </FormContext>
      <ManageFoodBeverageSurchargeModal
        defaultValues={currentSurcharge}
        onSubmit={handleAddSurcharge}
        visible={isSurchargeModalVisible}
        onClose={() => setIsSurchargeModalVisible(false)}
      />
    </>
  );
};
