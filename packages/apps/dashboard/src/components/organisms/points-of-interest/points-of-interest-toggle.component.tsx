import { Tag, toast, Tooltip } from '@src/components/atoms';
import { DropdownMenu, Inputs } from '@src/components/molecules';
import { sdk } from '@src/xhr/graphql-request';
import { useAttraction } from '@src/xhr/query';
import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

const SMenuWrapper = styled(DropdownMenu.MenuWrapper)`
  padding: 8px;
`;

interface Props {
  dropdown?: boolean;
}

export const PointsOfInterestToggle: React.FC<Props> = ({
  dropdown = true,
}) => {
  const { data: attraction, mutate: mutateAttraction } = useAttraction();

  const [loading, setLoading] = useState(false);

  const tagRef = useRef<HTMLDivElement>(null);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const isAttractionEnabled = attraction?.enabled;

  const isPlaces = useMemo(() => {
    return !!attraction?.catalog?.categories.flatMap((c) => c.places).length;
  }, [attraction?.catalog?.categories]);

  const handleToggleEnabled = async (value: boolean) => {
    setLoading(true);
    const toastId = toast.loader(
      `${value ? 'Enabling' : 'Disabling'} points of interest`
    );

    try {
      mutateAttraction((attraction) => {
        if (!attraction) {
          return attraction;
        }

        attraction.enabled = value;
        return attraction;
      }, false);

      await sdk.updateAttraction({
        data: { enabled: value },
      });

      toast.update(
        toastId,
        `Successfully ${value ? 'enabled' : 'disabled'} points of interest`
      );
    } catch {
      await mutateAttraction();
      toast.update(
        toastId,
        `Unable to ${value ? 'enable' : 'disable'} points of interest`
      );
    }

    setLoading(false);
  };

  return (
    <div>
      <Tooltip
        message={
          !isAttractionEnabled
            ? 'Points of interest is disabled'
            : !isPlaces
            ? 'Points of interest has no places'
            : ''
        }
      >
        <div ref={tagRef}>
          <Tag
            tagStyle={
              !isAttractionEnabled ? 'red' : !isPlaces ? 'blue-border' : 'blue'
            }
            onClick={
              dropdown
                ? () => {
                    setIsDropdownVisible(true);
                  }
                : undefined
            }
          >
            {!isAttractionEnabled ? 'Disabled' : !isPlaces ? 'Hidden' : 'Live'}
          </Tag>
        </div>
      </Tooltip>

      {dropdown ? (
        <SMenuWrapper
          buttonRef={tagRef}
          onClose={() => setIsDropdownVisible(false)}
          visible={isDropdownVisible}
        >
          <Inputs.Checkbox
            name="roomService"
            noRegister
            value={!!attraction?.enabled}
            onClick={handleToggleEnabled}
            toggle
            boldSideLabel
            sideLabel="Enable"
            disabled={loading}
          />
        </SMenuWrapper>
      ) : null}
    </div>
  );
};
