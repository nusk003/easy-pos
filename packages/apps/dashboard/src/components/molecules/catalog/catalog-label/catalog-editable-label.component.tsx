import { toast } from '@src/components/atoms';
import {
  CatalogLabelContextMenu,
  ContextMenu,
  Inputs,
} from '@src/components/molecules';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

export type CatalogLabel = {
  id: string;
  name: string;
};

interface LabelProps {
  label: CatalogLabel;
  onEdit: (editableLabel: CatalogLabel) => void;
  onDelete: () => void;
  onSelect: (label: CatalogLabel) => void;
  onUnselect: () => void;
  isSelected: boolean;
}

interface SLabelWrapperProps {
  selected?: boolean;
}

const STextInputWrapper = styled.div`
  margin-top: 8px;
  margin-right: 8px;
`;

const SLabelWrapper = styled.div<SLabelWrapperProps>`
  background: ${(props): string => (props.selected ? '#c2c2c2' : '#f0f0f0')};
  border: 1px solid transparent;
  border-radius: 100px;
  padding: 8px 16px;
  color: ${(props): string => (props.selected ? '#fff' : '#7e7e7e')};
  width: fit-content;
  cursor: pointer;
  user-select: none;
  visibility: initial;
  margin-right: 8px;
  margin-top: 8px;
  box-sizing: content-box;
`;

export const CatalogEditableLabel: React.FC<LabelProps> = ({
  label,
  onEdit,
  onDelete,
  isSelected: selected,
  onSelect,
  onUnselect,
}) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [editedLabel, setEditedLabel] = useState<CatalogLabel>({
    id: label.id,
    name: label.name,
  });

  const onChange = (name: string) => {
    setEditedLabel((editedLabel) => ({ ...editedLabel, name }));
  };

  useEffect(() => {
    if (isInputVisible) {
      setEditedLabel({ ...label });
    }
  }, [isInputVisible]);

  const onSubmit = () => {
    if (!editedLabel.name || editedLabel.name === '') {
      toast.warn("Label can't be empty");
      return;
    }
    setIsInputVisible(false);
    onEdit(editedLabel);
  };

  const onBlur = () => {
    setIsInputVisible(false);
    onSubmit();
  };

  return isInputVisible ? (
    <STextInputWrapper>
      <Inputs.Text
        wrapperStyle={{
          textAlign: 'center',
          borderRadius: 100,
        }}
        placeholder={`Edit ${label.name} label`}
        defaultValue={editedLabel.name}
        autoFocus
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        name="name"
        noRegister
        fitContent
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setIsInputVisible(false);
          }
          if (e.key === 'Enter') {
            onSubmit();
          }
        }}
      />
    </STextInputWrapper>
  ) : (
    <ContextMenu.MenuProvider
      menu={
        <CatalogLabelContextMenu
          key={label.id}
          onEdit={() => setIsInputVisible(true)}
          onDelete={onDelete}
        />
      }
      key={label.id}
    >
      <SLabelWrapper
        selected={selected}
        onClick={() => {
          if (selected) {
            onUnselect();
          } else {
            onSelect(label);
          }
        }}
      >
        {label.name}
      </SLabelWrapper>
    </ContextMenu.MenuProvider>
  );
};
