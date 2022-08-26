import { Button } from '@src/components/atoms';
import { useHotel } from '@src/xhr/query';
import React from 'react';
import styled from 'styled-components';

const SWrapper = styled.div`
  display: grid;
  justify-content: right;
  grid-auto-flow: column;
  gap: 8px;
`;

interface Props {
  onCancel?: () => void;
  enableFinish?: boolean;
}

export const ManageBookingsCheckInProgressButtons: React.FC<Props> = ({
  onCancel,
  enableFinish,
}) => {
  const { data: hotel } = useHotel();

  return (
    <SWrapper>
      {!hotel?.bookingsSettings ? (
        <>
          {onCancel ? (
            <Button buttonStyle="secondary" onClick={onCancel} type="button">
              {'← Back'}
            </Button>
          ) : null}
          <Button
            type="submit"
            buttonStyle={enableFinish ? 'primary' : 'secondary'}
          >
            {enableFinish ? 'Finish' : 'Next ->'}
          </Button>
        </>
      ) : (
        <>
          {onCancel ? (
            <Button buttonStyle="secondary" onClick={onCancel} type="button">
              Cancel
            </Button>
          ) : null}
          <Button type="submit" buttonStyle="primary">
            Save
          </Button>
        </>
      )}
    </SWrapper>
  );
};
