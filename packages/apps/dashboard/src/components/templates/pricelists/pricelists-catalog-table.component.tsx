import {
  PricelistCategory,
  PricelistDiscountLevel,
  PricelistItem,
} from '@hm/sdk';
import { Button } from '@src/components/atoms';
import { CatalogActionBar, Verify } from '@src/components/molecules';
import { CatalogTableDuplicateModal } from '@src/components/templates';
import { usePricelistStore } from '@src/store';
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
import { PricelistsCatalogTableCategory } from './pricelists-catalog-table-category.component';
import { PricelistsDiscountModal } from './pricelists-discount-modal.component';

const SDroppableChild = styled.div`
  display: grid;
`;

interface Props {
  categories: Array<PricelistCategory>;
  isPOSAvailable?: boolean;
}

export const PricelistsCatalogTable: React.FC<Props> = React.memo(
  ({ categories, isPOSAvailable }) => {
    const {
      setCategories,
      createCategory,
      deleteCategory,
      deleteItems,
      createItem,
      discountItem,
      setDiscountItem,
    } = usePricelistStore(
      useCallback(
        (state) => ({
          setCategories: state.setPricelistsCategories,
          createItem: state.createPricelistItem,
          createCategory: state.createPricelistsCategory,
          deleteCategory: state.deletePricelistsCategory,
          deleteItems: state.deletePricelistsItems,
          discountItem: state.pricelistsItemDiscount,
          setDiscountItem: state.setPricelistsItemDiscount,
        }),
        []
      )
    );

    const [isDeleteCategoryVerifyVisible, setIsDeleteCategoryVerifyVisible] =
      useState(false);
    const [isDeleteItemsVerifyVisible, setIsDeleteItemsVerifyVisible] =
      useState(false);
    const [
      isDuplicateCategoryModalVisible,
      setIsDuplicateCategoryModalVisible,
    ] = useState(false);
    const [isDuplicateItemModalVisible, setIsDuplicateItemModalVisible] =
      useState(false);

    const scrollBottomRef = useRef<HTMLDivElement>(null);

    const [expandCategoryId, setExpandedCategoryId] = useState<
      string | undefined
    >(undefined);

    const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
      {}
    );

    const [selectedCategoryId, setSelectedCategoryId] = useState<
      string | undefined
    >();

    const selectedCategory = useMemo(
      () => categories.find((c) => c.id === selectedCategoryId),
      [categories, selectedCategoryId]
    );

    const isItemsSelected = useMemo(
      () => Object.values(selectedItems).find((val) => val),
      [selectedItems]
    );
    const isOneItemSelected = useMemo(
      () => Object.values(selectedItems).filter((val) => val)?.length === 1,
      [selectedItems]
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

      setSelectedItems({});
    };

    const handleSelectCategory = (categoryId: string) => {
      if (selectedCategoryId === categoryId) {
        setSelectedCategoryId(undefined);
      } else {
        setSelectedCategoryId(categoryId);
      }

      setSelectedItems({});
    };

    const handleSelectItem = (itemId: string) => {
      setSelectedItems((s) => ({ ...s, [itemId]: !s[itemId] }));
      setSelectedCategoryId(undefined);
    };

    const handleAddCategory = useCallback(() => {
      createCategory();

      setTimeout(() => {
        if (scrollBottomRef.current) {
          scrollBottomRef.current.scrollIntoView({ block: 'end' });
        }
      }, 10);
    }, [createCategory]);

    const handleAddItem = () => {
      if (!expandCategoryId) {
        return;
      }

      createItem(expandCategoryId);
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

    const handleDeleteItems = () => {
      setSelectedItems({});

      deleteItems(
        Object.entries(selectedItems)
          .map(([itemId, selected]) => (selected ? itemId : ''))
          .filter(Boolean)
      );

      setIsDeleteItemsVerifyVisible(false);
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

    const handleDuplicateItem = (name: string) => {
      const selectedItemId = Object.entries(selectedItems).find(
        ([_itemId, selected]) => selected
      )?.[0];

      const selectedItem:
        | (PricelistItem & { categoryId?: string })
        | undefined = categories
        .flatMap((c) =>
          c.items.flatMap(({ ...item }) => ({
            ...item,
            categoryId: c.id,
          }))
        )
        .find((item) => item.id === selectedItemId);

      if (!selectedItem) {
        return;
      }

      const categoryId = selectedItem.categoryId!;
      delete selectedItem.categoryId;

      createItem(categoryId, { ...selectedItem, name });

      setIsDuplicateItemModalVisible(false);
      setSelectedItems({});
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
              {!isPOSAvailable ? (
                <Button buttonStyle="secondary" onClick={handleAddCategory}>
                  Add category
                </Button>
              ) : null}
              {isCategoryExpanded && !isPOSAvailable ? (
                <Button buttonStyle="secondary" onClick={handleAddItem}>
                  Add item
                </Button>
              ) : null}
              {isOneItemSelected && !isPOSAvailable ? (
                <Button
                  buttonStyle="secondary"
                  onClick={() => setIsDuplicateItemModalVisible(true)}
                >
                  Duplicate item
                </Button>
              ) : null}
              {isItemsSelected ? (
                <Button
                  buttonStyle="delete"
                  onClick={() => setIsDeleteItemsVerifyVisible(true)}
                >
                  Delete items
                </Button>
              ) : null}
              {isCategorySelected && !isPOSAvailable ? (
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
                            <PricelistsCatalogTableCategory
                              category={{ ...category }}
                              collapsed={expandCategoryId !== category.id}
                              onToggleCollapseCategory={
                                handleToggleCollapseCategory
                              }
                              categorySelected={
                                selectedCategoryId === category.id
                              }
                              onSelectCategory={handleSelectCategory}
                              selectedItems={selectedItems}
                              onSelectItem={handleSelectItem}
                              onAddItem={handleAddItem}
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

        <PricelistsDiscountModal
          level={PricelistDiscountLevel.Item}
          pricelist={discountItem?.pricelist}
          defaultValues={discountItem?.item?.promotions?.discounts?.[0]}
          visible={!!discountItem?.visible}
          onClose={() => setDiscountItem({ ...discountItem, visible: false })}
        />

        <CatalogTableDuplicateModal
          visible={isDuplicateItemModalVisible}
          onClose={() => setIsDuplicateItemModalVisible(false)}
          onSubmit={handleDuplicateItem}
          type="item"
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
          visible={isDeleteItemsVerifyVisible}
          onClose={() => setIsDeleteItemsVerifyVisible(false)}
          title={'Delete items'}
          type="delete"
          modal
          message={'Are you sure to delete the selected items?'}
          onVerify={handleDeleteItems}
        />
      </>
    );
  }
);
