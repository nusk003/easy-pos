import { AttractionCategory } from '@hm/sdk';
import {
  AnimatedCount,
  Button,
  InfoTooltip,
  Row,
  Text,
} from '@src/components/atoms';
import { theme } from '@src/components/theme';
import { usePointsOfInterestStore } from '@src/store';
import React, { useCallback } from 'react';
import styled from 'styled-components';

const SWrapper = styled.div`
  width: 456px;
  padding: 32px;
`;

const SButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-top: 32px;
`;

const SCount = styled.div`
  display: flex;
  justify-content: center;
  width: 16px;
  margin-right: 24px;
  text-align: center;
`;

interface PointsOfInterestSetupGenerateAttractionPlacesReviewCategoryTileProps {
  category: AttractionCategory;
}

const PointsOfInterestSetupGenerateAttractionPlacesReviewCategoryTile: React.FC<PointsOfInterestSetupGenerateAttractionPlacesReviewCategoryTileProps> =
  ({ category: { id, name, places } }) => {
    return (
      <Row key={id} mt="16px">
        <SCount>
          <Text.Heading color={theme.textColors.blue}>
            <AnimatedCount name={id} count={places.length} />
          </Text.Heading>
        </SCount>
        <Text.Primary fontWeight="regular">{name}</Text.Primary>
      </Row>
    );
  };

type Props = {
  onNext: () => void;
};

export const PointsOfInterestSetupGenerateAttractionPlacesReview: React.FC<Props> =
  ({ onNext }) => {
    const {
      selectedGeneratePlacesCategories,
      searchResultsAttractionCategories,
    } = usePointsOfInterestStore(
      useCallback(
        (state) => ({
          selectedGeneratePlacesCategories:
            state.selectedGeneratePlacesCategories,
          searchResultsAttractionCategories:
            state.searchResultsAttractionCategories,
        }),
        []
      )
    );

    return (
      <SWrapper>
        <Text.Heading>Points of Interest found near you</Text.Heading>
        <Text.Body fontWeight="semibold" mt="32px">
          Attraction Types
        </Text.Body>
        <Text.Body mt="8px" color={theme.textColors.lightGray}>
          Search for attraction types in your local area to select those you
          wish to share through your app
        </Text.Body>

        {searchResultsAttractionCategories.map((category) => (
          <PointsOfInterestSetupGenerateAttractionPlacesReviewCategoryTile
            key={category.name}
            category={category}
          />
        ))}

        <InfoTooltip mt="24px">
          {searchResultsAttractionCategories.length !==
          selectedGeneratePlacesCategories.length
            ? 'We are currently gathering the best attractions that are near to you. Feel free to explore the rest of your Dashboard as this will take a couple of minutes to complete. We’ll notify you when this is done.'
            : 'You can view and select which locations are displayed through your hotels app on the next screen'}
        </InfoTooltip>

        <SButtonWrapper>
          <Button
            buttonStyle="primary"
            onClick={onNext}
            disabled={
              searchResultsAttractionCategories.length !==
              selectedGeneratePlacesCategories.length
            }
          >
            Review {'->'}
          </Button>
        </SButtonWrapper>
      </SWrapper>
    );
  };
