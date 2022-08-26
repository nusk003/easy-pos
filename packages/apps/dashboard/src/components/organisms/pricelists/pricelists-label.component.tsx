import { Link } from '@src/components/atoms';
import {
  CatalogNewLabel,
  CatalogEditableLabel,
} from '@src/components/molecules';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { usePricelistStore } from '@src/store';
import { PricelistLabel } from '@hm/sdk';

const SLabelsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: -16px;
  box-sizing: content-box;
`;

interface Props {
  pricelistLabels: Array<PricelistLabel>;
  onChange: (labels: Array<PricelistLabel>) => void;
}

export const PricelistsLabel: React.FC<Props> = ({
  onChange,
  pricelistLabels,
}) => {
  const { catalog, createLabel, updateLabel, deleteLabel } = usePricelistStore(
    useCallback(
      (state) => ({
        catalog: state.pricelistsCatalog,
        createLabel: state.createPricelistsLabel,
        updateLabel: state.updatePricelistsLabel,
        deleteLabel: state.deletePricelistsLabel,
      }),
      []
    )
  );
  const [showAddLabel, setShowAddLabel] = useState<boolean>(false);

  const { labels } = catalog;

  const isSelected = useCallback(
    (label: PricelistLabel) => {
      const index = pricelistLabels.findIndex(({ id }) => id === label.id);
      return index > -1;
    },
    [pricelistLabels]
  );

  const onAddLabel = (label: PricelistLabel) => {
    onChange([...pricelistLabels, label]);
  };

  const onRemoveLabel = (label: PricelistLabel) => {
    onChange(
      pricelistLabels.filter((pricelistLabel) => pricelistLabel.id !== label.id)
    );
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
