import { Link } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { theme } from '@src/components/theme';
import React from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { AiFillDelete } from 'react-icons/ai';
import { MdDragHandle } from 'react-icons/md';
import styled from 'styled-components';

const SWrapper = styled.div``;

const SInputWrapper = styled.div`
  display: grid;
  grid-template-columns: auto minmax(auto, 600px) auto;
  gap: 8px;
  justify-content: left;
  margin-top: 16px;
  align-items: center;
`;

const SDeleteButton = styled(AiFillDelete).attrs({
  fill: theme.textColors.blue,
})`
  cursor: pointer;
  user-select: none;
`;

interface Props {
  name: string;
}

export const ManageBookingsCheckInArrivalInstructionsFields: React.FC<Props> =
  ({ name }) => {
    const { control } = useFormContext();
    const { fields, append, move, remove } = useFieldArray({
      control,
      name,
    });

    const handleDrag = ({ source, destination }: DropResult) => {
      if (destination) {
        move(source.index, destination.index);
      }
    };

    return (
      <SWrapper>
        <DragDropContext onDragEnd={handleDrag}>
          <div>
            <Droppable droppableId="test-items">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {fields.map((item, idx) => {
                    return (
                      <Draggable
                        key={`item-${idx}`}
                        draggableId={`item-${idx}`}
                        index={idx}
                      >
                        {(provided) => (
                          <SInputWrapper
                            key={item.id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <div {...provided.dragHandleProps}>
                              <MdDragHandle />
                            </div>
                            <Inputs.Text name={`${name}[${idx}]`} />
                            <SDeleteButton onClick={() => remove(idx)} />
                          </SInputWrapper>
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
        <Link
          disableOnClick={false}
          my={16}
          onClick={() => append({ value: '' })}
        >
          + Add an item
        </Link>
      </SWrapper>
    );
  };
