import { toast } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { CatalogLabel } from './catalog-editable-label.component';
import { EditableCatalogLabel } from './catalog-label.types';

const STextInputWrapper = styled.div`
  margin-top: 8px;
  margin-right: 8px;
`;

interface Props {
  onCancel: () => void;
  onCreate: (label: EditableCatalogLabel) => void;
}

export const CatalogNewLabel: React.FC<Props> = ({ onCancel, onCreate }) => {
  const [addedLabel, setAddedLabel] = useState<CatalogLabel>({
    id: v4(),
    name: '',
  });

  const handleSubmit = () => {
    if (!addedLabel.name || addedLabel.name === '') {
      toast.warn("Label can't be empty");
      return;
    }
    onCreate(addedLabel);
  };

  const handleChange = (name: string) => {
    setAddedLabel((label) => ({ ...label, name }));
  };

  return (
    <STextInputWrapper>
      <Inputs.Text
        wrapperStyle={{
          textAlign: 'center',
          borderRadius: 100,
        }}
        placeholder="Add a label"
        onBlur={handleSubmit}
        autoFocus
        noRegister
        onChange={(e) => handleChange(e.target.value)}
        name="name"
        fitContent
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onCancel();
          }
          if (e.key === 'Enter') {
            handleSubmit();
          }
        }}
      />
    </STextInputWrapper>
  );
};
