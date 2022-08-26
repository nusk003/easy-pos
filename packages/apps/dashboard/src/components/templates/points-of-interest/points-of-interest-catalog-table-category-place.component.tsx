import { AttractionCategory, AttractionPlace } from '@hm/sdk';
import { Button, Text } from '@src/components/atoms';
import { Table } from '@src/components/molecules';
import { theme } from '@src/components/theme';
import { usePointsOfInterestStore } from '@src/store';
import React, { useCallback } from 'react';
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

const SDescriptionText = styled(Text.Descriptor)`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface Props {
  category: AttractionCategory;
  place: AttractionPlace;
  selected: boolean;
  onSelectPlace: (placeId: string) => void;
}

export const PointsOfInterestCatalogTableCategoryPlace: React.FC<Props> = ({
  category,
  place,
  selected,
  onSelectPlace,
}) => {
  const { setPlaceSidebar } = usePointsOfInterestStore(
    useCallback(
      (state) => ({
        setPlaceSidebar: state.setPointsOfInterestPlaceSidebar,
      }),
      []
    )
  );

  return (
    <STableCell
      onClick={() =>
        setPlaceSidebar({
          category,
          place,
          visible: true,
        })
      }
    >
      <Table.Checkbox
        selected={selected}
        onClick={() => onSelectPlace(place.id!)}
        noWrapper
      />

      <div>
        <SNameText fontWeight="semibold">{place.name}</SNameText>
        {place.description ? (
          <SDescriptionText color={theme.textColors.lightGray} mt="4px">
            {place.description}
          </SDescriptionText>
        ) : null}
      </div>

      <Button
        onClick={() =>
          setPlaceSidebar({
            category,
            place,
            visible: true,
          })
        }
        buttonStyle="secondary"
      >
        Edit
      </Button>
    </STableCell>
  );
};
