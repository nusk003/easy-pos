import { ContextMenu } from '@src/components/molecules/context-menu';
import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

interface Props {
  onEdit: () => void;
  onDelete: () => void;
}

export const CatalogLabelContextMenu: React.FC<Props> = ({
  onDelete,
  onEdit,
}) => {
  return (
    <ContextMenu.MenuWrapper>
      <ContextMenu.Item onClick={onEdit}>
        <FaPlus /> Edit Label
      </ContextMenu.Item>
      <ContextMenu.Item onClick={onDelete}>
        <FaTrash /> Delete Label
      </ContextMenu.Item>
    </ContextMenu.MenuWrapper>
  );
};
