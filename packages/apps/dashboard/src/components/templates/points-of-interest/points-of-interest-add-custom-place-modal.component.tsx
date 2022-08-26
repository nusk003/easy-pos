import { Modal } from '@src/components/molecules';
import {
  PointsOfInterestCustomPlaceSearch,
  PointsOfInterestManualPlaceForm,
} from '@src/components/organisms';
import { usePointsOfInterestStore } from '@src/store';
import React, { useCallback } from 'react';

interface Props {
  onClose: () => void;
  visible: boolean;
}

export const PointsOfInterestAddCustomPlaceModal: React.FC<Props> = ({
  onClose,
  visible,
}) => {
  const { createPlaceModal } = usePointsOfInterestStore(
    useCallback(
      (state) => ({
        createPlaceModal: state.pointsOfInterestCreatePlaceModal,
      }),
      []
    )
  );

  return (
    <Modal visible={visible} onClose={onClose}>
      {!createPlaceModal?.isAddManualPlaceVisible ? (
        <PointsOfInterestCustomPlaceSearch />
      ) : (
        <PointsOfInterestManualPlaceForm />
      )}
    </Modal>
  );
};
