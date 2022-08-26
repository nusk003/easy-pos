import { AttractionCategory } from '@hm/sdk';
import { Link } from '@src/components/atoms';
import { Table } from '@src/components/molecules';
import { usePointsOfInterestStore } from '@src/store';
import { reorder } from '@src/util/drag-and-drop';
import React, { useCallback } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from 'react-beautiful-dnd';
import styled from 'styled-components';
import { PointsOfInterestCatalogTableCategoryHeader } from './points-of-interest-catalog-table-category-header.component';
import { PointsOfInterestCatalogTableCategoryPlace } from './points-of-interest-catalog-table-category-place.component';

const STableRow = styled(Table.Row)`
  user-select: none;
  cursor: unset;
`;

interface Props {
  category: AttractionCategory;
  collapsed: boolean;
  onToggleCollapseCategory: (categoryId: string) => void;
  categorySelected: boolean;
  onSelectCategory: (categoryId: string) => void;
  selectedPlaces: Record<string, boolean>;
  onSelectPlace: (placeId: string) => void;
  onAddPlace: () => void;
}

export const PointsOfInterestCatalogTableCategory: React.FC<Props> = ({
  category,
  collapsed,
  onToggleCollapseCategory,
  categorySelected,
  onSelectCategory,
  selectedPlaces,
  onSelectPlace,
  onAddPlace,
}) => {
  const { updateCategory } = usePointsOfInterestStore(
    useCallback(
      (state) => ({
        updateCategory: state.updatePointsOfInterestCategory,
      }),
      []
    )
  );

  const handleDragEnd: OnDragEndResponder = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      const newPlaces = reorder(
        category.places,
        result.source.index,
        result.destination.index
      );

      updateCategory({ ...category, ...{ places: newPlaces } });
    },
    [category, updateCategory]
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <>
        <Table.Provider>
          <PointsOfInterestCatalogTableCategoryHeader
            category={category}
            categorySelected={categorySelected}
            collapsed={collapsed}
            onSelectCategory={onSelectCategory}
            onToggleCollapseCategory={onToggleCollapseCategory}
          />

          {!collapsed ? (
            <Droppable
              key={category.id}
              droppableId="droppable-attraction-places"
            >
              {(provided) => (
                <Table.Body
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {category.places.length ? (
                    category.places.map((place, idx) => (
                      <Draggable
                        key={place.id!}
                        draggableId={place.id!}
                        index={idx}
                      >
                        {(provided) => (
                          <STableRow
                            cursor="unset"
                            key={place.id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <PointsOfInterestCatalogTableCategoryPlace
                              category={category}
                              place={place}
                              selected={selectedPlaces[place.id!]}
                              onSelectPlace={onSelectPlace}
                            />
                          </STableRow>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <Link
                      disableOnClick={false}
                      onClick={onAddPlace}
                      pl="16px"
                      pb="16px"
                    >
                      Add your first point of interest
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
