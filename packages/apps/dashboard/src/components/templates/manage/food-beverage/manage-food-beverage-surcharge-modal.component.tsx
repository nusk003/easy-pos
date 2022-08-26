import {
  PricelistDeliveryType,
  PricelistMultiplierType,
  PricelistSurcharge,
} from '@hm/sdk';
import { Text, toast } from '@src/components/atoms';
import { Inputs, Modal } from '@src/components/molecules';
import { Form } from '@src/components/templates';
import { validationResolver } from '@src/util/form';
import React, { useCallback, useEffect, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { format } from '@src/util/format';
import { v4 as uuid } from 'uuid';
import * as z from 'zod';

const SGrid = styled.div`
  display: grid;
  grid-auto-flow: column;
  column-gap: 32px;
`;

const SFormSection = styled.div`
  margin-top: 32px;
`;

const formSchema = z.object({
  name: z.string().nonempty('Please enter a name for the surcharge'),
  type: z.nativeEnum(PricelistMultiplierType),
  value: z.string().nonempty('Please enter the percentage surcharge'),
  roomService: z.boolean().optional(),
  tableService: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  visible: boolean;
  onClose: () => void;
  defaultValues?: PricelistSurcharge;
  onSubmit: (surcharges: PricelistSurcharge) => void;
}

export const ManageFoodBeverageSurchargeModal: React.FC<Props> = ({
  visible,
  onClose,
  defaultValues,
  onSubmit,
}) => {
  const [submitLoading, setSubmitLoading] = useState(false);

  const formMethods = useForm<FormValues>({
    validationResolver,
    validationContext: formSchema,
  });

  const typeWatch = formMethods.watch('type');

  const handleSubmit = useCallback(
    async (formValues: FormValues) => {
      setSubmitLoading(true);

      const value =
        formValues.type === PricelistMultiplierType.Percentage
          ? format.getNumber(formValues.value) / 100
          : format.getNumber(formValues.value);

      const surcharge: PricelistSurcharge = {
        id: defaultValues?.id || uuid(),
        name: formValues.name,
        type: formValues.type,
        value,
        delivery: [],
      };

      if (formValues.roomService) {
        surcharge.delivery!.push({
          type: PricelistDeliveryType.Room,
          enabled: true,
        });
      }

      if (formValues.tableService) {
        surcharge.delivery!.push({
          type: PricelistDeliveryType.Table,
          enabled: true,
        });
      }

      onSubmit(surcharge);

      setSubmitLoading(false);
      onClose();
    },
    [defaultValues, onClose, onSubmit]
  );

  useEffect(() => {
    if (!visible) {
      setTimeout(() => {
        formMethods.setValue('name', '');
        formMethods.setValue('value', '');
        formMethods.setValue(
          'type',
          undefined as unknown as PricelistMultiplierType
        );
        formMethods.setValue('roomService', false);
        formMethods.setValue('tableService', false);
      }, 300);
    } else {
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

  return (
    <Modal visible={visible} onClose={onClose}>
      <Form.ModalWrapper style={{ maxWidth: 460 }}>
        <Text.Interactive>Create a new automatic surcharge</Text.Interactive>
        <FormContext {...formMethods}>
          <Form.Provider onSubmit={formMethods.handleSubmit(handleSubmit)}>
            <Inputs.Text
              name="name"
              label="Surcharge Name"
              note="⌘ Guests will see this on the app so keep it short and sweet"
              placeholder="10% Service Charge"
            />

            <SGrid>
              <Inputs.Select
                name="type"
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
            </SGrid>

            <Inputs.Text
              label="Value"
              name="value"
              type={
                typeWatch === PricelistMultiplierType.Absolute
                  ? 'currency'
                  : typeWatch === PricelistMultiplierType.Percentage
                  ? 'percentage'
                  : undefined
              }
              sideLabel="of order total"
              placeholder={
                typeWatch === PricelistMultiplierType.Percentage ? '10%' : '5'
              }
              wrapperStyle={{
                width: 130,
              }}
            />

            <Text.Descriptor>
              You can end this surcharge anytime on the manage menu page.
            </Text.Descriptor>

            <Form.Submit loading={submitLoading} onCancel={onClose}>
              Add surcharge
            </Form.Submit>
          </Form.Provider>
        </FormContext>
      </Form.ModalWrapper>
    </Modal>
  );
};
