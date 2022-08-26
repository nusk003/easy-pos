import { PricelistCategory } from '@hm/sdk';
import { Button, Text } from '@src/components/atoms';
import { Inputs, Table } from '@src/components/molecules';
import { theme } from '@src/components/theme';
import { usePricelistStore } from '@src/store';
import React, { useCallback, useRef } from 'react';
import styled from 'styled-components';

const SNameText = styled(Text.Heading)``;

const SNameTextInput = styled(Inputs.BasicText)`
  font-size: 1.125rem;
`;

const STableHeader = styled(Table.Header)`
  justify-content: space-between;
  gap: 16px;

  ${theme.mediaQueries.tablet} {
    display: grid;
    grid-auto-flow: row;
    justify-content: unset;
  }
`;

const SContentWrapper = styled.div`
  display: grid;
  grid-gap: 24px;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  justify-self: start;
  white-space: unset;

  ${theme.mediaQueries.tablet} {
    justify-content: start;
  }
`;

const SDescriptionText = styled(Text.Descriptor)`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: break-spaces;
`;

const SActionsWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 16px;
  justify-items: end;

  ${theme.mediaQueries.tablet} {
    justify-content: end;
  }
`;

interface Props {
  category: PricelistCategory;
  collapsed: boolean;
  onToggleCollapseCategory: (categoryId: string) => void;
  categorySelected: boolean;
  onSelectCategory: (categoryId: string) => void;
}

export const PricelistsCatalogTableCategoryHeader: React.FC<Props> = ({
  category,
  collapsed,
  onToggleCollapseCategory,
  categorySelected,
  onSelectCategory,
}) => {
  const { updateCategory, deleteCategory, setCategorySidebar } =
    usePricelistStore(
      useCallback(
        (state) => ({
          updateCategory: state.updatePricelistsCategory,
          deleteCategory: state.deletePricelistsCategory,
          setCategorySidebar: state.setPricelistsCategorySidebar,
        }),
        []
      )
    );

  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleAddCategory = (
    event: React.KeyboardEvent | React.ChangeEvent
  ) => {
    if (
      nameInputRef.current?.value &&
      (!('key' in event) || event.key === 'Enter')
    ) {
      updateCategory({
        ...category,
        name: nameInputRef.current?.value,
      });

      onToggleCollapseCategory(category.id);
    } else if (!('key' in event)) {
      deleteCategory(category.id);
    }
  };

  return (
    <STableHeader>
      <SContentWrapper>
        <Table.Checkbox
          selected={categorySelected}
          onClick={() => onSelectCategory(category.id)}
          noWrapper
        />
        <div>
          {category.name ? (
            <SNameText pr="16px" fontWeight="semibold">
              {category.name}
            </SNameText>
          ) : (
            <SNameTextInput
              ref={nameInputRef}
              fontWeight="semibold"
              name="category-name"
              placeholder="Category name"
              width="300px"
              autoFocus
              style={{
                padding: 0,
              }}
              onKeyDown={handleAddCategory}
              onBlur={handleAddCategory}
              inputWrapperProps={{
                embedded: true,
                style: {
                  padding: 0,
                  marginLeft: -1,
                  marginBottom: 1,
                },
              }}
              autoComplete="off"
            />
          )}
          {category.description ? (
            <SDescriptionText mt="4px" fontWeight="medium">
              {category.description.trim()}
            </SDescriptionText>
          ) : null}
        </div>
      </SContentWrapper>
      <SActionsWrapper>
        <Button
          buttonStyle="secondary"
          onClick={() => setCategorySidebar({ category, visible: true })}
        >
          Edit {!collapsed ? 'Category' : null}
        </Button>

        <Button
          onClick={() => onToggleCollapseCategory(category.id)}
          buttonStyle="secondary"
        >
          {collapsed ? 'Expand' : 'Collapse'}
        </Button>
      </SActionsWrapper>
    </STableHeader>
  );
};
