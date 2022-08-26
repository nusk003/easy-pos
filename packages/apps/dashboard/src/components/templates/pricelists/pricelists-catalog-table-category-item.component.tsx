import { PricelistCategory, PricelistItem } from '@hm/sdk';
import { Button, Text, Grid } from '@src/components/atoms';
import { Inputs, Table } from '@src/components/molecules';
import { theme } from '@src/components/theme';
import { usePricelistStore } from '@src/store';
import { format } from '@src/util/format';
import React, { useCallback, useRef } from 'react';
import styled from 'styled-components';

const STableCell = styled(Table.Cell)`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 24px;
  width: unset;
  white-space: unset;
`;

const SNameText = styled(Text.Body)`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SNameTextInput = styled(Inputs.BasicText)`
  font-size: 0.8125rem;
`;

const SDescriptionText = styled(Text.Descriptor)`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface Props {
  category: PricelistCategory;
  item: PricelistItem;
  selected: boolean;
  onSelectItem: (itemId: string) => void;
}

export const PricelistsCatalogTableCategoryItem: React.FC<Props> = ({
  category,
  item,
  selected,
  onSelectItem,
}) => {
  const { setItemSidebar, updateItem, deleteItems } = usePricelistStore(
    useCallback(
      (state) => ({
        setItemSidebar: state.setPricelistsItemSidebar,
        updateItem: state.updatePricelistsItem,
        deleteItems: state.deletePricelistsItems,
      }),
      []
    )
  );

  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleAddItem = (event: React.KeyboardEvent | React.ChangeEvent) => {
    if (
      nameInputRef.current?.value &&
      (!('key' in event) || event.key === 'Enter')
    ) {
      const newItem = {
        ...item,
        name: nameInputRef.current?.value,
      };

      updateItem(newItem, category.id);

      setItemSidebar({
        category,
        item: newItem,
        visible: true,
      });
    } else if (!('key' in event)) {
      deleteItems([item.id]);
    }
  };

  return (
    <STableCell
      onClick={() =>
        setItemSidebar({
          category,
          item,
          visible: true,
        })
      }
    >
      <Table.Checkbox
        selected={selected}
        onClick={() => onSelectItem(item.id!)}
        noWrapper
      />

      <div>
        {item.name ? (
          <SNameText fontWeight="semibold">{item.name}</SNameText>
        ) : (
          <SNameTextInput
            ref={nameInputRef}
            fontWeight="semibold"
            name="category-name"
            placeholder="Item name"
            width="300px"
            autoFocus
            style={{
              padding: 0,
            }}
            onKeyDown={handleAddItem}
            onBlur={handleAddItem}
            inputWrapperProps={{
              embedded: true,
              style: {
                padding: 0,
                marginLeft: -1,
                marginBottom: 1,
              },
            }}
          />
        )}
        {item.description ? (
          <SDescriptionText color={theme.textColors.lightGray} mt="4px">
            {item.description}
          </SDescriptionText>
        ) : null}
      </div>

      <Grid gridAutoFlow="column" alignItems="center" gridGap="16px">
        {item.roomServicePrice ? (
          <Text.Descriptor fontWeight="semibold">
            {format.currency(item.roomServicePrice)}
          </Text.Descriptor>
        ) : null}
        <Button
          onClick={() => {
            setItemSidebar({
              category,
              item: { ...item },
              visible: true,
            });
          }}
          buttonStyle="secondary"
        >
          Edit
        </Button>
      </Grid>
    </STableCell>
  );
};
