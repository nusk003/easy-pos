import { Tag } from '@src/components/atoms';
import { DropdownMenu, Inputs } from '@src/components/molecules';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';

interface Props {
  enabled: boolean;
  dropdown?: boolean;
  onToggle?: (value: boolean) => void;
}

const SMenuWrapper = styled(DropdownMenu.MenuWrapper)`
  padding: 8px;
`;

export const ToggleDropdown: React.FC<Props> = ({
  enabled,
  dropdown = true,
  onToggle,
}) => {
  const tagRef = useRef<HTMLDivElement>(null);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  return (
    <div>
      <div ref={tagRef}>
        <Tag
          tagStyle={enabled ? 'blue' : 'red'}
          onClick={
            dropdown
              ? () => {
                  setIsDropdownVisible(true);
                }
              : undefined
          }
        >
          {enabled ? 'Live' : 'Disabled'}
        </Tag>
      </div>

      {dropdown && onToggle ? (
        <SMenuWrapper
          buttonRef={tagRef}
          onClose={() => setIsDropdownVisible(false)}
          visible={isDropdownVisible}
        >
          <Inputs.Checkbox
            name="roomService"
            noRegister
            value={enabled}
            onClick={(value) => onToggle(value)}
            toggle
            boldSideLabel
            sideLabel="Enable"
          />
        </SMenuWrapper>
      ) : null}
    </div>
  );
};
