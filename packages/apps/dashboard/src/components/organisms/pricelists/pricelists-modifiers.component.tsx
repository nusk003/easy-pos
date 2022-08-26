import { Button, Link, Text } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { ErrorText } from '@src/components/molecules/inputs/text.component';
import { Form } from '@src/components/templates';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import uuid from 'uuid/v4';

const SWrapper = styled.div`
  display: grid;
  grid-gap: 16px;
`;

const SCloseButton = styled(Text.Body)`
  cursor: pointer;
  user-select: none;
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  width: max-content;
  font-size: 10px;
`;

const SOptionsWrapper = styled.div``;

const SOptionWrapper = styled.div``;

const SOptionInputsWrapper = styled.div`
  display: grid;
  grid-template-columns: min-content 3fr min-content 1fr;
  align-items: center;
  grid-gap: 8px;
  justify-content: left;
`;

const SModifierText = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  grid-gap: 8px;
  grid-template-columns: max-content;
  padding-bottom: 4px;
`;

interface OptionsProps {
  modifierIndex: number;
  isPOSAvailable: boolean;
}

const PricelistsOptions: React.FC<OptionsProps> = ({
  modifierIndex,
  isPOSAvailable,
}) => {
  const { control, errors } = useFormContext();

  const { fields, append, ...fieldArray } = useFieldArray({
    control,
    name: `modifiers[${modifierIndex}].options`,
  });

  const remove = (optionIndex: number) => {
    fieldArray.remove(optionIndex);
  };

  const add = () => {
    append({ id: uuid(), price: '0' });
  };

  return (
    <SOptionsWrapper>
      {fields.map((option, optionIndex) => {
        const inputNamePrefix = `modifiers[${modifierIndex}].options[${optionIndex}]`;
        return (
          <SOptionWrapper key={option.id}>
            <SOptionInputsWrapper>
              <Inputs.Text
                name={`${inputNamePrefix}.id`}
                defaultValue={option.id}
                disabled={isPOSAvailable}
                hidden
              />

              <SCloseButton
                onClick={
                  !isPOSAvailable
                    ? () => {
                        remove(optionIndex);
                      }
                    : undefined
                }
              >
                {'✕'}
              </SCloseButton>

              <Inputs.Text
                embedded
                name={`${inputNamePrefix}.name`}
                placeholder="Type an option"
                disabled={isPOSAvailable}
                hideError
                style={{ minWidth: 50 }}
              />
              <div>+</div>
              <Inputs.Text
                embedded
                name={`${inputNamePrefix}.price`}
                disabled={isPOSAvailable}
                type="currency"
                defaultValue="0.00"
                style={{ minWidth: 50 }}
              />
            </SOptionInputsWrapper>
            {errors?.[`${inputNamePrefix}.name`]?.message ? (
              <ErrorText mb="8px">
                {errors?.[`${inputNamePrefix}.name`]?.message}
              </ErrorText>
            ) : null}
          </SOptionWrapper>
        );
      })}

      {!isPOSAvailable ? (
        <Link disableOnClick={false} onClick={add} mt="small">
          Add option +
        </Link>
      ) : null}
    </SOptionsWrapper>
  );
};

interface Props {
  isPOSAvailable: boolean;
}

export const PricelistsModifiers: React.FC<Props> = ({ isPOSAvailable }) => {
  const { control, watch } = useFormContext();

  const { fields, append, ...fieldArray } = useFieldArray({
    control,
    name: 'modifiers',
  });

  const remove = (modifierIndex: number) => {
    fieldArray.remove(modifierIndex);
  };

  return (
    <SWrapper>
      {fields.map((modifier, modifierIndex) => {
        const watchedModifier = watch(`modifiers[${modifierIndex}]`);
        const watchedOptions = watch(`modifiers[${modifierIndex}].options`);

        const selectItems = [
          ...Array.from(
            { length: (watchedOptions?.length ?? 0) - 1 },
            (_, i) => i + 1
          ),
          'All',
        ];

        return (
          <SWrapper key={modifier.id}>
            <Inputs.Text
              name={`modifiers[${modifierIndex}].id`}
              defaultValue={modifier.id}
              disabled={isPOSAvailable}
              hidden
            />
            <Form.Section>
              <SModifierText>
                <SCloseButton
                  onClick={
                    !isPOSAvailable ? () => remove(modifierIndex) : undefined
                  }
                >
                  {'✕'}
                </SCloseButton>
                <Text.Body>
                  Modifier{' '}
                  {watchedModifier?.name ? `- ${watchedModifier?.name}` : ''}
                </Text.Body>
              </SModifierText>
              <Inputs.Text
                name={`modifiers[${modifierIndex}].name`}
                placeholder="Choose a pizza crust"
                disabled={isPOSAvailable}
              />
            </Form.Section>
            <Form.CheckboxWrapper>
              <Inputs.Checkbox
                disabled={isPOSAvailable}
                name={`modifiers[${modifierIndex}].required`}
              />
              <Text.Body>Required</Text.Body>
            </Form.CheckboxWrapper>

            <PricelistsOptions
              isPOSAvailable={isPOSAvailable}
              modifierIndex={modifierIndex}
            />

            <Inputs.Select
              label="Max selection"
              disabled={isPOSAvailable}
              name={`modifiers[${modifierIndex}].maxSelection`}
              items={selectItems}
              defaultValue={modifier?.maxSelection || 'All'}
            />
          </SWrapper>
        );
      })}
      {!isPOSAvailable ? (
        <Button
          onClick={() => append({ id: uuid() })}
          type="button"
          buttonStyle="secondary"
        >
          Add a Modifier
        </Button>
      ) : null}
    </SWrapper>
  );
};
