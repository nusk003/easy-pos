import { AttractionCategory } from '@hm/sdk';
import { Button } from '@src/components/atoms';
import { CatalogActionBar, Verify } from '@src/components/molecules';
import { CatalogTableDuplicateModal } from '@src/components/templates';
import { usePointsOfInterestStore } from '@src/store';
import { reorder } from '@src/util/drag-and-drop';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from 'react-beautiful-dnd';
import styled from 'styled-components';
import { PointsOfInterestCatalogTableCategory } from './points-of-interest-catalog-table-category.component';

const SDroppableChild = styled.div`
  display: grid;
`;

interface Props {
  categories: Array<AttractionCategory>;
}

export const PointsOfInterestCatalogTable: React.FC<Props> = React.memo(
  ({ categories }) => {
    const {
      setCategories,
      createCategory,
      setCreatePlaceModal,
      deleteCategory,
      deletePlaces,
    } = usePointsOfInterestStore(
      useCallback(
        (state) => ({
          setCategories: state.setPointsOfInterestCategories,
          createCategory: state.createPointsOfInterestCategory,
          setCreatePlaceModal: state.setPointsOfInterestCreatePlaceModal,
          deleteCategory: state.deletePointsOfInterestCategory,
          deletePlaces: state.deletePointsOfInterestPlaces,
        }),
        []
      )
    );

    const [isDeleteCategoryVerifyVisible, setIsDeleteCategoryVerifyVisible] =
      useState(false);
    const [isDeletePlacesVerifyVisible, setIsDeletePlacesVerifyVisible] =
      useState(false);
    const [
      isDuplicateCategoryModalVisible,
      setIsDuplicateCategoryModalVisible,
    ] = useState(false);

    const scrollBottomRef = useRef<HTMLDivElement>(null);

    const [expandCategoryId, setExpandedCategoryId] = useState<
      string | undefined
    >(undefined);

    const [selectedPlaces, setSelectedPlaces] = useState<
      Record<string, boolean>
    >({});

    const [selectedCategoryId, setSelectedCategoryId] = useState<
      string | undefined
    >();

    const selectedCategory = useMemo(
      () => categories.find((c) => c.id === selectedCategoryId),
      [categories, selectedCategoryId]
    );

    const isPlacesSelected = useMemo(
      () => Object.values(selectedPlaces).find((val) => val),
      [selectedPlaces]
    );
    const isCategorySelected = !!selectedCategoryId;
    const isCategoryExpanded = !!expandCategoryId;

    const onDragEnd: OnDragEndResponder = useCallback(
      (result) => {
        if (!result.destination) {
          return;
        }

        const newCategories = reorder(
          categories,
          result.source.index,
          result.destination.index
        );

        setCategories(newCategories);
      },
      [categories, setCategories]
    );

    const handleToggleCollapseCategory = (categoryId: string) => {
      if (expandCategoryId === categoryId) {
        setExpandedCategoryId(undefined);
      } else {
        setExpandedCategoryId(categoryId);
      }

      setSelectedPlaces({});
    };

    const handleSelectCategory = (categoryId: string) => {
      if (selectedCategoryId === categoryId) {
        setSelectedCategoryId(undefined);
      } else {
        setSelectedCategoryId(categoryId);
      }

      setSelectedPlaces({});
    };

    const handleSelectPlace = (placeId: string) => {
      setSelectedPlaces((s) => ({ ...s, [placeId]: !s[placeId] }));
      setSelectedCategoryId(undefined);
    };

    const handleAddCategory = () => {
      createCategory();

      setTimeout(() => {
        if (scrollBottomRef.current) {
          scrollBottomRef.current.scrollIntoView({ block: 'end' });
        }
      }, 10);
    };

    const handleAddPlace = () => {
      if (!expandCategoryId) {
        return;
      }

      setCreatePlaceModal({
        visible: true,
        category: categories.find((c) => c.id === expandCategoryId),
      });
    };

    const handleDeleteCategory = () => {
      setIsDeleteCategoryVerifyVisible(false);

      setTimeout(() => {
        if (selectedCategoryId) {
          deleteCategory(selectedCategoryId);
        }

        setExpandedCategoryId(undefined);
        setSelectedCategoryId(undefined);
      }, 300);
    };

    const handleDeletePlaces = () => {
      setSelectedPlaces({});

      deletePlaces(
        Object.entries(selectedPlaces)
          .map(([placeId, selected]) => (selected ? placeId : ''))
          .filter(Boolean)
      );

      setIsDeletePlacesVerifyVisible(false);
    };

    const handleDuplicateCategory = (name: string) => {
      const categoryId = createCategory({ ...selectedCategory, name });

      setIsDuplicateCategoryModalVisible(false);

      setTimeout(() => {
        if (scrollBottomRef.current) {
          scrollBottomRef.current.scrollIntoView({ block: 'end' });
        }
        setExpandedCategoryId(categoryId);
        setSelectedCategoryId(undefined);
      }, 10);
    };

    useEffect(() => {
      if (!categories.length) {
        handleAddCategory();
      }
    }, [categories, handleAddCategory]);

    return (
      <>
        <>
          <CatalogActionBar>
            <>
              <Button buttonStyle="secondary" onClick={handleAddCategory}>
                Add category
              </Button>
              {isCategoryExpanded ? (
                <Button buttonStyle="secondary" onClick={handleAddPlace}>
                  Add place
                </Button>
              ) : null}
              {isPlacesSelected ? (
                <Button
                  buttonStyle="delete"
                  onClick={() => setIsDeletePlacesVerifyVisible(true)}
                >
                  Delete places
                </Button>
              ) : null}
              {isCategorySelected ? (
                <>
                  <Button
                    buttonStyle="secondary"
                    onClick={() => setIsDuplicateCategoryModalVisible(true)}
                  >
                    Duplicate category
                  </Button>
                  <Button
                    buttonStyle="delete"
                    onClick={() => setIsDeleteCategoryVerifyVisible(true)}
                  >
                    Delete category
                  </Button>
                </>
              ) : null}
            </>
          </CatalogActionBar>

          <div>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                key="droppable-attraction-categories"
                droppableId="droppable-attraction-categories"
              >
                {(provided) => (
                  <SDroppableChild
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {categories.map((category, idx) => (
                      <Draggable
                        index={idx}
                        key={category.id}
                        draggableId={category.id}
                        isDragDisabled={isCategoryExpanded}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              paddingBottom: 16,
                              ...provided.draggableProps.style,
                            }}
                          >
                            <PointsOfInterestCatalogTableCategory
                              category={category}
                              collapsed={expandCategoryId !== category.id}
                              onToggleCollapseCategory={
                                handleToggleCollapseCategory
                              }
                              categorySelected={
                                selectedCategoryId === category.id
                              }
                              onSelectCategory={handleSelectCategory}
                              selectedPlaces={selectedPlaces}
                              onSelectPlace={handleSelectPlace}
                              onAddPlace={handleAddPlace}
                              key={category.id}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </SDroppableChild>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <div ref={scrollBottomRef} />
        </>

        <CatalogTableDuplicateModal
          visible={isDuplicateCategoryModalVisible}
          onClose={() => setIsDuplicateCategoryModalVisible(false)}
          onSubmit={handleDuplicateCategory}
          type="category"
        />

        <Verify
          visible={isDeleteCategoryVerifyVisible}
          onClose={() => setIsDeleteCategoryVerifyVisible(false)}
          title={`Delete ${selectedCategory?.name}`}
          type="delete"
          modal
          message={`Are you sure to delete "${selectedCategory?.name}"?`}
          onVerify={handleDeleteCategory}
        />

        <Verify
          visible={isDeletePlacesVerifyVisible}
          onClose={() => setIsDeletePlacesVerifyVisible(false)}
          title={'Delete places'}
          type="delete"
          modal
          message={'Are you sure to delete the selected places?'}
          onVerify={handleDeletePlaces}
        />
      </>
    );
  }
);
