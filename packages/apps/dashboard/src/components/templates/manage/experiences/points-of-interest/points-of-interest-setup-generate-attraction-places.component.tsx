import {
  GenerateAttractionPlacesCategoriesQuery,
  GenerateAttractionPlacesMutationVariables,
} from '@hm/sdk';
import GoogleImage from '@src/assets/icons/powered-by-google.png';
import { Button, InfoTooltip, Row, Text, toast } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { theme } from '@src/components/theme';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

const SWrapper = styled.div`
  width: 456px;
  padding: 32px;
`;

const SButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
`;

interface Props {
  onNext: (data: GenerateAttractionPlacesMutationVariables) => void;
  generatePlacesCategories: GenerateAttractionPlacesCategoriesQuery['generateAttractionPlacesCategories'];
}

interface SelectedCategories {
  name: string;
  checked: boolean;
}

export const PointsOfInterestSetupGenerateAttractionPlaces: React.FC<Props> = ({
  onNext,
  generatePlacesCategories,
}) => {
  const [categories, setCategories] = useState<Array<SelectedCategories>>([]);
  const [radius, setRadius] = useState(4);

  useEffect(() => {
    setCategories(
      generatePlacesCategories.map(({ name }) => {
        return {
          name,
          checked: false,
        };
      })
    );
  }, [generatePlacesCategories]);

  const handleToggleCheckbox: (checked: boolean, index: number) => void =
    useCallback((checked, index) => {
      setCategories((s) => {
        s[index].checked = checked;
        return [...s];
      });
    }, []);

  const handleNext = () => {
    const filteredCategories: Array<{ name: string }> = [];

    categories.forEach((category) => {
      if (category.checked) filteredCategories.push({ name: category.name });
    });

    if (filteredCategories.length === 0) {
      toast.warn('Please select at least one category');
      return;
    }

    if (!radius) {
      toast.warn('Please enter a radius');
      return;
    }

    onNext({
      categories: filteredCategories,
      radius: radius * 1000,
    } as GenerateAttractionPlacesMutationVariables);
  };

  return (
    <SWrapper>
      <Text.Heading>Search for Points of Interest</Text.Heading>

      <Row mt="16px">
        <Text.Primary mr="8px">Search within</Text.Primary>
        <Inputs.BasicText
          defaultValue={4}
          onChange={(e) => setRadius(parseInt(e.currentTarget.value))}
          name="radius"
          style={{ width: 20, textAlign: 'center' }}
          type="text"
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
          }}
          onBlur={(e) => {
            if (!e.currentTarget.value) {
              e.currentTarget.value = '4';
            }
          }}
          maxLength={2}
        />
        <Text.Primary ml="8px">km radius of your location</Text.Primary>
      </Row>

      <Text.Body fontWeight="semibold" mt="16px">
        Select Category Types
      </Text.Body>
      <Text.Body mt="8px" color={theme.textColors.lightGray}>
        Search for Point of Interest category types in your local area to select
        those you wish to share through your app
      </Text.Body>

      {categories.map(({ name, checked }, index) => (
        <Row key={name} mt="16px">
          <Inputs.Checkbox
            toggle
            noRegister
            defaultChecked={checked}
            name="category"
            onClick={() => handleToggleCheckbox(!checked, index)}
            mr="16px"
          />
          <Text.Primary fontWeight="400">{name}</Text.Primary>
        </Row>
      ))}

      <InfoTooltip mt="24px">
        This feature requires guest messaging to be set up. You may also turn
        this on or off later.
      </InfoTooltip>

      <SButtonWrapper>
        <img src={GoogleImage} />
        <Button buttonStyle="primary" onClick={handleNext}>
          Search →
        </Button>
      </SButtonWrapper>
    </SWrapper>
  );
};
