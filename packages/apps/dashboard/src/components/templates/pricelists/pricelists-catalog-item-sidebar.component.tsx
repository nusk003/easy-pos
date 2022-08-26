import {
  Pricelist,
  PricelistItem,
  PricelistItemModifier,
  PricelistItemOption,
} from '@hm/sdk';
import { Button, Grid, Link, Row, Text, toast } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import {
  PricelistsLabel,
  PricelistsModifiers,
} from '@src/components/organisms';
import { Form } from '@src/components/templates';
import { usePricelistStore } from '@src/store';
import { fileToBase64 } from '@src/util/file';
import { validationResolver } from '@src/util/form';
import { format } from '@src/util/format';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as z from 'zod';

const SContentFormWrapper = styled.div`
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
  name: z.string().nonempty('Please enter the name of the item'),
  description: z.string().max(500, 'Description is too long'),
  snoozed: z.boolean().optional(),
  regularPrice: z.string().nonempty('Invalid regular price'),
  roomServicePrice: z.string().nonempty('Invalid room service price'),
  note: z.string().max(500, 'Note is too long').optional(),
  photo: z.string().optional(),
  posSettings: z
    .object({
      roomService: z.string(),
      tableService: z.string(),
    })
    .optional(),
  modifiers: z
    .array(
      z.object({
        id: z.string().nonempty(),
        name: z.string().nonempty('Please enter the name of the modifier'),
        maxSelection: z.string().nonempty(),
        required: z.boolean().optional(),
        options: z.array(
          z.object({
            id: z.string().nonempty(),
            name: z.string().nonempty('Please enter the name of the option'),
            price: z.string(),
          })
        ),
      })
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  pricelist: Pricelist;
}

export const PricelistsCatalogItemSidebar: React.FC<Props> = ({
  pricelist,
}) => {
  const { updateItem, sidebar, setSidebar, setDiscount } = usePricelistStore(
    useCallback(
      (state) => ({
        updateItem: state.updatePricelistsItem,
        sidebar: state.pricelistsItemSidebar,
        setSidebar: state.setPricelistsItemSidebar,
        setDiscount: state.setPricelistsItemDiscount,
      }),
      []
    )
  );

  const [state, setState] = useState({ isNoteVisible: !!sidebar?.item?.note });
  const [editableItem, setEditableItem] = useState(sidebar?.item);
  const [isPricelistsLabelsVisible, setIsPricelistsLabelsVisible] =
    useState(false);

  const omnivorePriceLevels = sidebar?.item?.posSettings?.priceLevels;

  const defaultValues = useMemo(() => {
    const d = { ...editableItem } as unknown as FormValues;

    if (editableItem?.modifiers) {
      const modifiers: typeof d.modifiers = [];
      const newModifiers = [...editableItem?.modifiers];
      newModifiers.forEach((modifier) => {
        const options: Array<{ id: string; name: string; price: string }> = [];
        modifier.options.forEach((option) => {
          options.push({
            ...option,
            ...{ price: String(option.price) },
          });
        });
        modifiers.push({
          ...modifier,
          ...{
            maxSelection:
              modifier.maxSelection === -1
                ? 'All'
                : String(modifier.maxSelection),
            options,
          },
        });
      });
      d.modifiers = modifiers;
      d.photo = editableItem.photos?.[0];
    }

    if (editableItem?.posSettings) {
      const plr = omnivorePriceLevels?.find(
        ({ posId }) => posId === editableItem?.posSettings?.roomService?.posId
      );

      const plt = omnivorePriceLevels?.find(
        ({ posId }) => posId === editableItem?.posSettings?.tableService?.posId
      );

      if (plr && plt) {
        d.posSettings = { tableService: plt.name, roomService: plr.name };
      }
    }
    return d;
  }, [editableItem, omnivorePriceLevels]);

  const formMethods = useForm<FormValues>({
    defaultValues,
    validationContext: formSchema,
    validationResolver,
  });

  useEffect(() => {
    formMethods.register('photo');

    setImmediate(() => {
      formMethods.setValue('photo', defaultValues.photo);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddNote = () => {
    setState((s) => ({ ...s, isNoteVisible: true }));
  };

  useEffect(() => {
    if (sidebar?.visible !== undefined && !sidebar.visible) {
      setTimeout(() => {
        setIsPricelistsLabelsVisible(false);
      }, 300);
    } else {
      setIsPricelistsLabelsVisible(true);
    }
  }, [sidebar?.visible]);

  useEffect(() => {
    if (sidebar?.item) setEditableItem({ ...sidebar?.item });
  }, [sidebar, setEditableItem]);

  const handleImageUpload = async (file: File, setImage: () => void) => {
    const base64Img = await fileToBase64(file);
    formMethods.setValue('photo', base64Img);
    setImage();
    setEditableItem((s) => ({ ...(s as PricelistItem), photos: [base64Img] }));
  };

  const handleRemovePhoto = () => {
    setEditableItem((s) => ({ ...(s as PricelistItem), photos: undefined }));
    formMethods.setValue('photo', undefined);
  };

  const omnivorePriceLevelsSelect = useMemo(
    () => omnivorePriceLevels?.map(({ name }) => name),
    [omnivorePriceLevels]
  );

  const roomServiceWatch = formMethods.watch('posSettings.roomService');
  const tableServiceWatch = formMethods.watch('posSettings.tableService');

  const roomPriceLevel = useMemo(
    () => omnivorePriceLevels?.find(({ name }) => name === roomServiceWatch),
    [omnivorePriceLevels, roomServiceWatch]
  );
  const tablePriceLevel = useMemo(
    () => omnivorePriceLevels?.find(({ name }) => name === tableServiceWatch),
    [omnivorePriceLevels, tableServiceWatch]
  );

  useEffect(() => {
    if (roomPriceLevel) {
      formMethods.setValue(
        'roomServicePrice',
        format.currency(roomPriceLevel.price.toString())
      );
    }

    if (tablePriceLevel) {
      formMethods.setValue(
        'regularPrice',
        format.currency(tablePriceLevel.price.toString())
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomPriceLevel, tablePriceLevel]);

  const handleSubmit = useCallback(
    (formValues: FormValues) => {
      const photo = formValues.photo;
      delete formValues.photo;

      const newItem = {
        ...editableItem,
        ...formValues,
      } as unknown as PricelistItem;

      newItem.regularPrice = format.getNumber(formValues.regularPrice);
      newItem.roomServicePrice = format.getNumber(formValues.roomServicePrice);
      newItem.photos = photo ? [photo] : undefined;

      if (newItem.posSettings) {
        if (roomPriceLevel) {
          newItem.posSettings.roomService = roomPriceLevel;
        }

        if (tablePriceLevel) {
          newItem.posSettings.tableService = tablePriceLevel;
        }

        newItem.posSettings.priceLevels =
          editableItem?.posSettings?.priceLevels;
      }
      if (formValues.modifiers) {
        const modifiers: PricelistItemModifier[] = [];
        formValues.modifiers.forEach((modifier) => {
          const options: PricelistItemOption[] = [];
          modifier.options.forEach((option) => {
            options.push({
              ...option,
              ...{ price: format.getNumber(option.price) },
            });
          });

          modifiers.push({
            ...modifier,
            ...{
              options,
              maxSelection:
                modifier.maxSelection === 'All'
                  ? -1
                  : parseFloat(modifier.maxSelection),
            },
          } as PricelistItemModifier);
        });

        newItem.modifiers = modifiers;
      } else {
        newItem.modifiers = [];
      }

      setImmediate(() => {
        toast.info(`Saved "${newItem.name}"`);
        updateItem(newItem, sidebar!.category!.id);
      });
    },
    [editableItem, sidebar, updateItem, roomPriceLevel, tablePriceLevel]
  );

  const handleClose = () => {
    setSidebar({
      visible: false,
    });
  };

  const handleToggleDiscount = useCallback(() => {
    if (sidebar?.item && sidebar.category)
      setDiscount({
        visible: true,
        item: { ...sidebar.item },
        category: { ...sidebar.category },
        pricelist,
      });
  }, [setDiscount, sidebar?.item, sidebar?.category, pricelist]);

  const discounts = editableItem?.promotions?.discounts;

  const onRemoveDiscount = useCallback(() => {
    if (editableItem) {
      const newItem = { ...editableItem, promotions: undefined };
      setSidebar({ ...sidebar, item: newItem });
    }
  }, [editableItem, sidebar, setSidebar]);

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

        <SContentFormWrapper>
          <Inputs.Text
            embedded
            name="name"
            wrapperStyle={{ paddingLeft: 0 }}
            style={{ fontSize: 16 }}
          />

          {isPricelistsLabelsVisible ? (
            <PricelistsLabel
              onChange={(labels) => {
                setEditableItem({
                  ...editableItem!,
                  ...{ labels: [...labels] },
                });
              }}
              pricelistLabels={editableItem?.labels || []}
            />
          ) : null}

          <Inputs.Checkbox toggle name="snoozed" sideLabel="Snooze item" />

          <Grid gridAutoFlow="column" justifyContent="start" gridGap="24px">
            {pricelist.posSettings && omnivorePriceLevelsSelect?.length ? (
              <Inputs.Select
                items={omnivorePriceLevelsSelect}
                label="Room service"
                name="posSettings.roomService"
              />
            ) : null}
            <Inputs.Text
              width="140px"
              name="roomServicePrice"
              disabled={pricelist.posSettings?.enabled}
              placeholder="9.5"
              type="currency"
              label="Room service price"
            />
          </Grid>

          <Grid gridAutoFlow="column" justifyContent="start" gridGap="24px">
            {pricelist.posSettings && omnivorePriceLevelsSelect?.length ? (
              <Inputs.Select
                items={omnivorePriceLevelsSelect}
                label="Table service"
                name="posSettings.tableService"
              />
            ) : null}
            <Inputs.Text
              width="140px"
              name="regularPrice"
              disabled={pricelist.posSettings?.enabled}
              placeholder="8.5"
              type="currency"
              label="Regular Price"
            />
          </Grid>

          <div>
            <Text.Body fontWeight="medium" mb="8px">
              Discount
            </Text.Body>
            {discounts?.length ? (
              discounts.map((discount) => (
                <Row key={discount.id}>
                  <Link
                    disableOnClick={false}
                    onClick={onRemoveDiscount}
                    linkStyle="red"
                    mr="8px"
                  >
                    {'✕'}
                  </Link>
                  <Link disableOnClick={false} onClick={handleToggleDiscount}>
                    {discount.name}
                  </Link>
                </Row>
              ))
            ) : (
              <Link
                mt="8px"
                disableOnClick={false}
                onClick={handleToggleDiscount}
              >
                Add discount +
              </Link>
            )}
          </div>

          <Inputs.Text
            name="description"
            placeholder="Slow braised British free-range pork. Also known as “carnitas”, it’s hand-shredded and seasoned with..."
            multiLine
            label="Description"
            maxCharacters={500}
          />

          <div>
            <Inputs.File
              defaultValue={editableItem?.photos?.[0]}
              compressImage
              acceptOnlyImages
              label="Photo"
              name="photo"
              onChange={handleImageUpload}
            />
            {editableItem?.photos?.[0] ? (
              <Link
                linkStyle="red"
                mt="8px"
                disableOnClick={false}
                onClick={handleRemovePhoto}
              >
                Remove photo
              </Link>
            ) : null}
          </div>

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

          <PricelistsModifiers
            isPOSAvailable={!!pricelist.posSettings?.enabled}
          />
        </SContentFormWrapper>
      </Form.Provider>
    </FormContext>
  );
};
