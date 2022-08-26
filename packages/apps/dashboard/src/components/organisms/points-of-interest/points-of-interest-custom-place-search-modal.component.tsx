import { AttractionPlace } from '@hm/sdk';
import PoweredByGoogle from '@src/assets/icons/powered-by-google.png';
import { Button, Row, Text } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { SearchItem } from '@src/components/molecules/inputs/search.component';
import { Form } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { usePointsOfInterestStore } from '@src/store';
import { validationResolver } from '@src/util/form';
import { sdk } from '@src/xhr/graphql-request';
import _ from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import * as z from 'zod';

interface PlaceSearchItem extends SearchItem {
  payload?: string;
}

const SWrapper = styled.div`
  padding: 32px;
  height: max-content;
`;

const SGoogleImage = styled.img`
  justify-self: end;
  padding: 8px 12px 12px 0px;
`;

const formSchema = z.object({
  search: z.string().nonempty('Please enter keyword'),
});

type FormValues = z.infer<typeof formSchema>;

export const PointsOfInterestCustomPlaceSearch: React.FC = () => {
  const searchRef = useRef<HTMLInputElement>(null);

  const formMethods = useForm<FormValues>({
    validationContext: formSchema,
    validationResolver,
    submitFocusError: false,
  });

  const [searchPlaces, setSearchPlaces] = useState<Array<SearchItem>>([]);
  const [place, setPlace] = useState<AttractionPlace | undefined>();
  const { createPlace, setCreatePlaceModal, createPlaceModal } =
    usePointsOfInterestStore(
      useCallback(
        (state) => ({
          createPlace: state.createPointsOfInterestPlace,
          setCreatePlaceModal: state.setPointsOfInterestCreatePlaceModal,
          createPlaceModal: state.pointsOfInterestCreatePlaceModal,
        }),
        []
      )
    );

  const onSearchChange = useCallback(
    _.debounce(async (query) => {
      if (!query || query === '') {
        return;
      }

      const { searchCustomAttractionPlace } =
        await sdk.searchCustomAttractionPlace({ query });

      const searchPlaces: Array<SearchItem> = [];
      searchCustomAttractionPlace.forEach(({ title, placeId, description }) =>
        searchPlaces.push({
          title,
          subheading: description,
          payload: placeId,
        })
      );

      setSearchPlaces(searchPlaces);
    }, 500),
    []
  );

  const handlePlaceClick = async ({ payload }: PlaceSearchItem) => {
    const { attractionPlacebyPlaceID } = await sdk.attractionPlacebyPlaceID({
      placeId: payload!,
    });

    if (searchRef.current) {
      searchRef.current.value = attractionPlacebyPlaceID.name;
    }

    setPlace({ id: uuid(), ...attractionPlacebyPlaceID });
  };

  const handleAddPlace = () => {
    setPlace(undefined);
    createPlace(place!);
    setCreatePlaceModal(undefined);

    setTimeout(() => {
      searchRef.current!.value = '';
    }, 300);
  };

  const handleAddManually = () => {
    const name = searchRef.current?.value;
    setCreatePlaceModal({
      placeName: name,
      visible: true,
      isAddManualPlaceVisible: true,
      category: createPlaceModal!.category,
    });
    setPlace(undefined);
  };

  return (
    <SWrapper>
      <Text.Heading>Search for points of interest</Text.Heading>
      <Text.Body mt="8px" mb="24px" color={theme.textColors.lightGray}>
        Begin searching for your location to automatically capture details
      </Text.Body>

      <FormContext {...formMethods}>
        <Form.Provider>
          <Inputs.Search
            data={searchPlaces}
            footer={
              <SGoogleImage
                src={PoweredByGoogle}
                alt="Powered By Google"
                width="144px"
              />
            }
            fallbackData={{
              title: 'None of the above',
              subheading: 'Enter Point of Interest manually',
            }}
            onFallbackClick={() => setPlace(undefined)}
            onClick={handlePlaceClick}
            onChange={(e) => onSearchChange(e.target.value)}
            noRegister
            name={'search-point-of-interest'}
            placeholder="Search points of interest"
            ref={searchRef}
          />
        </Form.Provider>
      </FormContext>

      {place ? (
        <Row mt="16px" justifyContent="space-between">
          <div style={{ padding: '8px' }}>
            <Text.Primary fontWeight="semibold">{place.name}</Text.Primary>
            <Text.Primary mt="8px" color={theme.textColors.lightGray}>
              {place.address}
            </Text.Primary>
            <Text.Primary mt="8px" color={theme.textColors.lightGray}>
              {place.website}
            </Text.Primary>
            <Text.Primary mt="8px" color={theme.textColors.lightGray}>
              {place.phone}
            </Text.Primary>
          </div>
          {place.photos.length > 0 ? (
            <img
              style={{ borderRadius: '12px' }}
              width="106px"
              src={place.photos[0]}
            />
          ) : null}
        </Row>
      ) : null}

      <Row mt="24px" justifyContent="space-between">
        <Button onClick={handleAddManually} buttonStyle="secondary">
          Add Manually
        </Button>
        {place ? (
          <Button onClick={handleAddPlace} buttonStyle="primary">
            Continue
          </Button>
        ) : null}
      </Row>
    </SWrapper>
  );
};
