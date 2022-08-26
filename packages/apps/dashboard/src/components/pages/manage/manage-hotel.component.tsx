import { Coordinates } from '@hm/sdk';
import PoweredByGoogle from '@src/assets/icons/powered-by-google.png';
import { toast } from '@src/components/atoms';
import { CountryPicker, Inputs } from '@src/components/molecules';
import { SearchItem } from '@src/components/molecules/inputs/basic-search.component';
import {
  Form,
  Header,
  ManageFormSection,
  ManageFormWrapper,
} from '@src/components/templates';
import countryData from '@src/components/templates/create-account/country-data.json';
import { validationResolver } from '@src/util/form';
import { sdk } from '@src/xhr/graphql-request';
import { useHotel, useUser } from '@src/xhr/query';
import Fuse from 'fuse.js';
import _ from 'lodash';
import React, { useRef, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import * as z from 'zod';

const SGoogleImage = styled.img`
  justify-self: end;
  padding: 8px 12px 14px 0px;
`;

const fuse = new Fuse(countryData, {
  keys: ['name', 'synonyms'],
});

const formSchema = z.object({
  name: z.string().nonempty('Please enter a valid hotel name'),
  address: z.object({
    country: z.string().nonempty('Please enter a valid country'),
    postalCode: z.string().nonempty('Please enter a valid ZIP/postal code'),
    line1: z.string().nonempty('Please enter a valid address line'),
    line2: z.string().nonempty('Please enter a valid address line'),
    town: z.string().nonempty('Please enter a valid town'),
  }),
  telephone: z.string().nonempty('Please enter a valid telephone number'),
});

type FormSchema = z.infer<typeof formSchema> & {
  countryCode?: string;
  address: {
    placeId?: string;
    coordinates?: Coordinates;
  };
};

export const ManageHotel = () => {
  const { data: hotel } = useHotel();
  const { mutate: mutateUser } = useUser(false);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [state, setState] = useState({
    sessionToken: uuid(),
    isAddressChosen: !!hotel?.address?.line1,
  });

  interface SearchAddress extends SearchItem {
    payload?: { placeId: string };
  }
  const [searchAddresses, setSearchAddresses] = useState<SearchAddress[]>([]);

  const addressData = useRef<{
    placeId?: string;
    coordinates?: Coordinates;
  }>({ placeId: undefined, coordinates: undefined });

  const addressSearchRef = useRef<HTMLInputElement>(null);

  const formMethods = useForm<FormSchema>({
    defaultValues: {
      name: hotel?.name,
      address: hotel?.address as FormSchema['address'],
      countryCode: hotel?.countryCode,
      telephone: hotel?.telephone,
    },
    validationResolver,
    validationContext: formSchema,
  });

  const handleAddressChange = _.debounce(async (query: string) => {
    if (!query) {
      setSearchAddresses([]);
      return;
    }

    const { googlePlacesHotelSearch } = await sdk.googlePlacesHotelSearch({
      query,
      sessionToken: state.sessionToken,
    });

    setSearchAddresses(
      googlePlacesHotelSearch.map((place) => ({
        title: place.title,
        subtitle: place.description,
        payload: { placeId: place.placeId },
      }))
    );
  }, 700);

  const handleAddressClick = async (searchAddress: SearchAddress) => {
    if (!searchAddress || !searchAddress.payload) {
      return;
    }

    const { googlePlacesHotelDetails } = await sdk.googlePlacesHotelDetails({
      placeId: searchAddress.payload.placeId,
      sessionToken: state.sessionToken,
    });

    const country = formMethods.getValues('address.country');

    Object.entries(googlePlacesHotelDetails).forEach(([key, value]) => {
      if (key === 'country' && country) {
        const country = fuse.search(value! as string);
        if (country) {
          formMethods.setValue('address.country', country?.[0].item.name || '');
        }
      } else {
        formMethods.setValue(`address.${key}`, value);
      }
    });
    formMethods.setValue('name', googlePlacesHotelDetails.name);

    addressData.current = {
      coordinates: googlePlacesHotelDetails.coordinates,
      placeId: googlePlacesHotelDetails.placeId,
    };

    state.isAddressChosen = true;
    state.sessionToken = uuid();
    setState((s) => ({ ...s, sessionToken: uuid(), isAddressChosen: true }));

    setSearchAddresses([]);
  };

  const handleAddressFallbackClick = () => {
    formMethods.setValue('address.line1', null);
    formMethods.setValue('address.line2', null);
    formMethods.setValue('address.town', null);
    formMethods.setValue('address.postalCode', null);
    formMethods.setValue('address.country', null);

    addressData.current = { coordinates: undefined, placeId: undefined };

    setState((s) => ({ ...s, isAddressChosen: true }));
    setSearchAddresses([]);
  };

  const handleSubmit = async (formValues: FormSchema) => {
    if ('address' in formValues) {
      formValues.address.coordinates = addressData.current.coordinates;
      formValues.address.placeId = addressData.current.placeId;

      const country = countryData.find(
        (c) => c.name === formValues.address.country
      );

      if (!country) {
        toast.info('Please enter a valid country name');
        return;
      }

      formValues.countryCode = country?.countryCode;
    }

    setSubmitLoading(true);

    try {
      await sdk.updateHotel({ data: formValues });
      toast.info('Successfully updated settings');
      await mutateUser();
    } catch {
      toast.warn('Unable to update settings');
    }

    setSubmitLoading(false);
  };

  return (
    <>
      <FormContext {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
          <Header backgroundColor="#fafafa" title="Hotel" />
          <ManageFormWrapper>
            <ManageFormSection
              title="Address"
              description="We use your address to give guests information on how to reach your property and to generate point of interest with Google Maps"
            >
              <Inputs.Search
                name="name"
                placeholder="Name of hotel"
                label="Name"
                ref={addressSearchRef}
                onChange={(e) => handleAddressChange(e.target.value)}
                data={searchAddresses}
                onClick={handleAddressClick}
                onFallbackClick={handleAddressFallbackClick}
                fallbackData={{
                  title: 'None of the above',
                  subheading: 'Enter address manually',
                }}
                footer={
                  <SGoogleImage
                    src={PoweredByGoogle}
                    alt="Powered By Google"
                    width="144px"
                  />
                }
              />
              <Inputs.Text
                name="address.line1"
                placeholder="Address line 1"
                label="Address"
              />
              <Inputs.Text name="address.line2" placeholder="Address line 2" />
              <Inputs.Text name="address.town" placeholder="Town or city" />
              <Inputs.Text
                name="address.postalCode"
                placeholder="ZIP code or postcode"
              />
              <CountryPicker name="address.country" />
            </ManageFormSection>

            <ManageFormSection
              title="Contact information"
              description="We use your contact information on your app to give guests an alternate way to contact you"
            >
              <Inputs.Text
                name="telephone"
                label="Contact number"
                placeholder="Contact number"
              />
            </ManageFormSection>

            <Form.Submit loading={submitLoading}>Save</Form.Submit>
          </ManageFormWrapper>
        </form>
      </FormContext>
    </>
  );
};
