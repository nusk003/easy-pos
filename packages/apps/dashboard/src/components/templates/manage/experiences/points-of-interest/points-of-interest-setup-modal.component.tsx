import {
  GenerateAttractionPlacesCategoriesQuery,
  GenerateAttractionPlacesCategoryArgs,
  GenerateAttractionPlacesMutationVariables,
} from '@hm/sdk';
import { toast } from '@src/components/atoms';
import { Modal } from '@src/components/molecules';
import { usePointsOfInterestStore } from '@src/store';
import { sdk } from '@src/xhr/graphql-request';
import { useAttraction } from '@src/xhr/query';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import {
  PointsOfInterestSetupGeneral,
  PointsOfInterestSetupGeneralFormValues,
} from './points-of-interest-setup-general.component';
import { PointsOfInterestSetupGenerateAttractionPlacesReview } from './points-of-interest-setup-generate-attraction-places-review.component';
import { PointsOfInterestSetupGenerateAttractionPlaces } from './points-of-interest-setup-generate-attraction-places.component';
import { PointsOfInterestSetupMode } from './points-of-interest-setup-mode.component';

export enum SetupMode {
  Automatic,
  Manual,
}

enum Step {
  General,
  SetupMode,
  GenerateAttractionPlaces,
  ReviewAttractionPlaces,
}

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const PointsOfInterestSetupModal: React.FC<Props> = ({
  visible,
  onClose,
}) => {
  const history = useHistory();

  const [state, setState] = useState({
    step: Step.General,
    requestBooking: false,
  });

  const [generatePlacesCategories, setGeneratePlacesCategories] = useState<
    GenerateAttractionPlacesCategoriesQuery['generateAttractionPlacesCategories']
  >([]);

  const {
    setShowResultsModal,
    showResultsModal,
    setSelectedGeneratePlacesCategories,
  } = usePointsOfInterestStore((state) => ({
    setShowResultsModal: state.setShowGeneratePlaceResultsModal,
    showResultsModal: state.showGeneratePlaceResultsModal,
    setSelectedGeneratePlacesCategories:
      state.setSelectedGeneratePlacesCategories,
  }));

  const { mutate: mutateAttraction } = useAttraction(false);

  const handleNextPageGeneral = async (
    formValues: PointsOfInterestSetupGeneralFormValues
  ) => {
    const toastId = toast.loader('Creating points of interest');

    try {
      await sdk.createAttraction({ ...formValues, enabled: false });
      toast.update(toastId, 'Successfully created points of interest');

      setState((s) => ({
        ...s,
        step: Step.SetupMode,
        requestBooking: !!formValues.requestBooking,
      }));
    } catch {
      toast.update(toastId, 'Unable to create points of interest');
    }
  };

  const onSetupOptionClicked = useCallback(
    async (selectedOption: SetupMode) => {
      if (selectedOption === SetupMode.Automatic) {
        setState((s) => ({ ...s, step: Step.GenerateAttractionPlaces }));
      }

      if (selectedOption === SetupMode.Manual) {
        await mutateAttraction();
        history.push('/points-of-interest');
      }
    },
    [history, mutateAttraction]
  );

  const handleGenerateAttractionPlaces = useCallback(
    async ({
      categories,
      radius,
    }: GenerateAttractionPlacesMutationVariables) => {
      await sdk.generateAttractionPlaces({
        categories,
        radius,
        requestBooking: state.requestBooking,
      });

      toast.info(
        "We're generating points of interest. This operation will take a few moments to complete. We'll notify you once it's done."
      );

      setSelectedGeneratePlacesCategories(
        categories as GenerateAttractionPlacesCategoryArgs[]
      );
      setState((s) => ({ ...s, step: Step.ReviewAttractionPlaces }));
      setShowResultsModal(true);
    },
    [
      setSelectedGeneratePlacesCategories,
      setShowResultsModal,
      state.requestBooking,
    ]
  );

  const handleNextReview = useCallback(() => {
    history.push('/points-of-interest');
  }, [history]);

  const loadGeneratePlacesCategories = async () => {
    try {
      const { generateAttractionPlacesCategories } =
        await sdk.generateAttractionPlacesCategories();

      setGeneratePlacesCategories(generateAttractionPlacesCategories);
      // eslint-disable-next-line no-empty
    } catch {}
  };

  useEffect(() => {
    loadGeneratePlacesCategories();
  }, []);

  const RenderedPage = useMemo(() => {
    if (showResultsModal || state.step === Step.ReviewAttractionPlaces) {
      return (
        <PointsOfInterestSetupGenerateAttractionPlacesReview
          onNext={handleNextReview}
        />
      );
    } else if (state.step === Step.General) {
      return <PointsOfInterestSetupGeneral onNext={handleNextPageGeneral} />;
    } else if (state.step === Step.SetupMode) {
      return <PointsOfInterestSetupMode onNext={onSetupOptionClicked} />;
    } else if (state.step === Step.GenerateAttractionPlaces) {
      return (
        <PointsOfInterestSetupGenerateAttractionPlaces
          generatePlacesCategories={generatePlacesCategories}
          onNext={handleGenerateAttractionPlaces}
        />
      );
    }

    return null;
  }, [
    generatePlacesCategories,
    handleGenerateAttractionPlaces,
    handleNextReview,
    onSetupOptionClicked,
    showResultsModal,
    state.step,
  ]);

  useEffect(() => {
    if (showResultsModal) {
      setState((s) => ({ ...s, isModalVisible: true }));
    }
  }, [showResultsModal]);

  return (
    <>
      <Modal onClose={onClose} visible={visible}>
        {RenderedPage}
      </Modal>
    </>
  );
};
