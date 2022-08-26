import { PricelistCategory } from '@hm/sdk';
import { Link } from '@src/components/atoms';
import { Table } from '@src/components/molecules';
import { usePricelistStore } from '@src/store';
import { reorder } from '@src/util/drag-and-drop';
import React, { useCallback } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from 'react-beautiful-dnd';
import styled from 'styled-components';
import { PricelistsCatalogTableCategoryHeader } from './pricelists-catalog-table-category-header.component';
import { PricelistsCatalogTableCategoryItem } from './pricelists-catalog-table-category-item.component';

const STableRow = styled(Table.Row)`
  user-select: none;
  cursor: unset;
`;

interface Props {
  category: PricelistCategory;
  collapsed: boolean;
  onToggleCollapseCategory: (categoryId: string) => void;
  categorySelected: boolean;
  onSelectCategory: (categoryId: string) => void;
  selectedItems: Record<string, boolean>;
  onSelectItem: (itemId: string) => void;
  onAddItem: () => void;
}

export const PricelistsCatalogTableCategory: React.FC<Props> = ({
  category,
  collapsed,
  onToggleCollapseCategory,
  categorySelected,
  onSelectCategory,
  selectedItems,
  onSelectItem,
  onAddItem,
}) => {
  const { updateCategory } = usePricelistStore(
    useCallback(
      (state) => ({
        updateCategory: state.updatePricelistsCategory,
      }),
      []
    )
  );

  const handleDragEnd: OnDragEndResponder = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      const newItems = reorder(
        category.items,
        result.source.index,
        result.destination.index
      );

      updateCategory({ ...category, ...{ items: newItems } });
    },
    [category, updateCategory]
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <>
        <Table.Provider>
          <PricelistsCatalogTableCategoryHeader
            category={category}
            categorySelected={categorySelected}
            collapsed={collapsed}
            onSelectCategory={onSelectCategory}
            onToggleCollapseCategory={onToggleCollapseCategory}
          />

          {!collapsed ? (
            <Droppable
              key={category.id}
              droppableId="droppable-pricelist-items"
            >
              {(provided) => (
                <Table.Body
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {category.items.length ? (
                    category.items.map((item, idx) => (
                      <Draggable
                        key={item.id!}
                        draggableId={item.id!}
                        index={idx}
                      >
                        {(provided) => (
                          <STableRow
                            cursor="unset"
                            key={item.id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <PricelistsCatalogTableCategoryItem
                              category={category}
                              item={item}
                              selected={selectedItems[item.id!]}
                              onSelectItem={onSelectItem}
                            />
                          </STableRow>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <Link
                      disableOnClick={false}
                      onClick={onAddItem}
                      pl="16px"
                      pb="16px"
                    >
                      Add your first item
                    </Link>
                  )}

                  {provided.placeholder}
                </Table.Body>
              )}
            </Droppable>
          ) : null}
        </Table.Provider>
      </>
    </DragDropContext>
  );
};
