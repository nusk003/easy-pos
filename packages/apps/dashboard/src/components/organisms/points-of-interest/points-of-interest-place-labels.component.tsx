import { AttractionPlaceLabel } from '@hm/sdk';
import { Link } from '@src/components/atoms';
import {
  CatalogEditableLabel,
  CatalogNewLabel,
} from '@src/components/molecules';
import { usePointsOfInterestStore } from '@src/store';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

const SLabelsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: -16px;
  box-sizing: content-box;
`;

interface Props {
  placeLabels: Array<AttractionPlaceLabel>;
  onChange: (labels: Array<AttractionPlaceLabel>) => void;
}

export const PointsOfInterestPlaceLabels: React.FC<Props> = ({
  onChange,
  placeLabels = [],
}) => {
  const { catalog, createLabel, updateLabel, deleteLabel } =
    usePointsOfInterestStore(
      useCallback(
        (state) => ({
          catalog: state.pointsOfInterestCatalog,
          createLabel: state.createPointsOfInterestLabel,
          updateLabel: state.updatePointsOfInterestLabel,
          deleteLabel: state.deletePointsOfInterestLabel,
        }),
        []
      )
    );
  const [showAddLabel, setShowAddLabel] = useState<boolean>(false);

  const { labels } = catalog;

  const isSelected = useCallback(
    (label: AttractionPlaceLabel) => {
      const index = placeLabels.findIndex(
        (placeLabel) => placeLabel.id === label.id
      );
      return index > -1;
    },
    [placeLabels]
  );

  const onAddLabel = (label: AttractionPlaceLabel) => {
    onChange([...placeLabels, label]);
  };

  const onRemoveLabel = (label: AttractionPlaceLabel) => {
    onChange(placeLabels.filter((placeLabel) => placeLabel.id !== label.id));
  };

  return (
    <SLabelsWrapper>
      {showAddLabel ? (
        <CatalogNewLabel
          onCancel={() => setShowAddLabel(false)}
          onCreate={(label) => {
            onAddLabel(label);
            createLabel(label);
            setShowAddLabel(false);
          }}
        />
      ) : null}

      {labels
        ? labels.map((label, index) => (
            <CatalogEditableLabel
              isSelected={isSelected(label)}
              onSelect={onAddLabel}
              onUnselect={() => onRemoveLabel(label)}
              onEdit={(updatedLabel) => {
                updateLabel(updatedLabel);
              }}
              onDelete={() => {
                deleteLabel(index);
              }}
              label={label}
              key={label.id}
            />
          ))
        : null}

      <Link
        disableOnClick={false}
        mt="8px"
        onClick={() => {
          setShowAddLabel(true);
        }}
      >
        Add a label +
      </Link>
    </SLabelsWrapper>
  );
};
