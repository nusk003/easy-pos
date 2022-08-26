import PoweredByGoogle from '@src/assets/icons/powered-by-google.png';
import { Button, Link, Text, toast } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import {
  CreateAccountForm,
  CreateAccountFormSectionInputWrapper,
  CreateAccountFormSection,
} from '@src/components/organisms';
import { Form } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { validationResolver } from '@src/util/form';
import Fuse from 'fuse.js';
import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useStore } from '@src/store';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import * as z from 'zod';
import countryData from './country-data.json';
import { SearchItem } from '@src/components/molecules/inputs/search.component';
import { sdk } from '@src/xhr/graphql-request';
import { Coordinates, RegisterGroupAdminMutationVariables } from '@hm/sdk';

interface DisplayProps {
  display: boolean | undefined;
}

const options = {
  keys: ['name', 'synonyms'],
};

const fuse = new Fuse(countryData, options);

const specificCountryList = countryData.map((country) => country.name);

const SFormWrapper = styled.div<DisplayProps>`
  display: ${(props): string => (props.display ? 'block' : 'none')};
`;

const SGoogleImage = styled.img`
  justify-self: end;
  padding: 8px 12px 14px 0px;
`;

const SDescriptorWrapper = styled.div`
  display: grid;
  grid-gap: 8px;
`;

const SInputDescriptor = styled(Text.Descriptor)`
  font-size: 12.5px;
  color: ${theme.textColors.lightGray};
`;

const SNextButton = styled(Button)`
  width: 100%;
`;

const SReviewWrapper = styled.div<DisplayProps>`
  display: ${(props): string => (props.display ? 'block' : 'none')};
  position: absolute;
  z-index: 2;
  background: ${theme.colors.white};
  width: 504px;
  min-height: 900px;
`;

const SReviewSectionTitle = styled(Text.Primary)`
  font-weight: 600;
  font-size: 18px;
  padding-bottom: 8px;
`;

const SReviewSectionWrapper = styled.div`
  grid-gap: 16px;
  margin-bottom: 24px;
`;

const SReviewInformation = styled(Text.Primary)`
  font-size: 14px;
  color: ${theme.textColors.lightGray};
`;

const SActionWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 24px;
  margin-top: 36px;
  align-items: center;
  justify-content: end;
`;

const formSchema = z.object({
  group: z.object({ name: z.string() }),
  hotel: z.object({
    name: z.string().nonempty('Please enter a valid hotel name'),
    address: z.object({
      line1: z.string().nonempty('Please enter a valid address line'),
      line2: z.string(),
      town: z.string().nonempty('Please enter a valid town '),
      postalCode: z.string().nonempty('Please enter a valid postal code'),
      country: z.string().nonempty('Please enter a valid country'),
    }),
    website: z.string().nonempty('Please enter a valid website'),
    telephone: z.string().nonempty('Please enter a valid hotel contact number'),
    countryCode: z.string().optional(),
  }),
  user: z.object({
    mobile: z.string().optional(),
    jobTitle: z.string().nonempty('Please enter a valid job title'),
  }),
});

type FormValues = z.infer<typeof formSchema> & {
  hotel: {
    address: {
      placeId?: string;
      coordinates?: Coordinates;
    };
  };
};

export const CreateAccountHotel: React.FC = () => {
  const history = useHistory();

  const { createAccount: createAccountState, setCreateAccount } = useStore(
    useCallback(
      (state) => ({
        createAccount: state.createAccount,
        setCreateAccount: state.setCreateAccount,
      }),
      []
    )
  );

  const [state, setState] = useState<{
    isReviewOpen: boolean;
    sessionToken: string;
    isAddressChosen: boolean;
    formValues?: FormValues;
  }>({
    isReviewOpen: false,
    sessionToken: uuid(),
    isAddressChosen: !!createAccountState?.hotel?.address?.line1,
  });

  interface SearchAddress extends SearchItem {
    payload?: { placeId: string };
  }
  const [searchAddresses, setSearchAddresses] = useState<SearchAddress[]>([]);

  interface SearchCountry extends SearchItem {
    payload?: { name: string; countryCode: string };
  }
  const [searchCountries, setSearchCountries] = useState<SearchCountry[]>([]);

  const addressData = useRef<{
    placeId?: string;
    coordinates?: Coordinates;
  }>({ placeId: undefined, coordinates: undefined });

  const addressSearchRef = useRef<HTMLInputElement>(null);
  const countrySearchRef = useRef<HTMLInputElement>(null);

  const formMethods = useForm<FormValues>({
    defaultValues: createAccountState as unknown as FormValues,
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

    Object.entries(googlePlacesHotelDetails).forEach(([key, value]) => {
      if (key === 'country' && countrySearchRef.current) {
        const country = fuse.search(value! as string);
        if (countrySearchRef?.current) {
          countrySearchRef.current.value = country?.[0].item.name || '';
        }
      } else {
        formMethods.setValue(`hotel.address.${key}`, value);
      }
    });

    formMethods.setValue('hotel.name', googlePlacesHotelDetails.name);

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
    setState((s) => ({ ...s, isAddressChosen: true }));
    setSearchAddresses([]);
  };

  const handleCountryChange = _.debounce(async (query: string) => {
    if (!query) {
      setSearchCountries([]);
      return;
    }

    const searchResponse = fuse.search(query);

    if (searchResponse) {
      setSearchCountries(
        searchResponse.slice(0, 3).map((country) => {
          return {
            title: country.item.name,
            payload: {
              name: country.item.name,
              countryCode: country.item.countryCode,
            },
          };
        })
      );
    }
  }, 700);

  const handleCountryClick = (country: SearchCountry) => {
    if (!country) {
      return;
    }

    if (countrySearchRef?.current) {
      countrySearchRef.current.value = country.payload?.name || '';
    }

    setSearchCountries([]);
  };

  const openReview = (formValues: FormValues) => {
    const country = countryData.find(
      (c) => c.name === formValues.hotel.address.country
    );

    formValues.hotel.countryCode = country?.countryCode;

    formValues.hotel.address.coordinates = addressData.current.coordinates;
    formValues.hotel.address.placeId = addressData.current.placeId;

    if (!formValues.hotel.countryCode) {
      toast.info('Please enter a valid country name');
      return;
    }

    setState((s) => ({ ...s, formValues, isReviewOpen: true }));
  };

  const submitForm = () => {
    const user = {
      ...createAccountState.user,
      ...state.formValues?.user,
    };

    const hotel = {
      ...createAccountState.hotel,
      ...state.formValues?.hotel,
    };

    setCreateAccount({
      ...createAccountState,
      user,
      hotel,
    } as RegisterGroupAdminMutationVariables);

    history.push('/create-account/billing');
  };

  useEffect(() => {
    if (!createAccountState?.user?.firstName) {
      history.push('/create-account/user');
    }
  }, [createAccountState?.user?.firstName, history]);

  return (
    <CreateAccountForm
      title={
        !state.isReviewOpen ? "Let's set up your hotel" : 'Review and confirm'
      }
    >
      <FormContext {...formMethods}>
        <Form.Provider onSubmit={formMethods.handleSubmit(openReview)}>
          <SFormWrapper display={!state.isReviewOpen}>
            <CreateAccountFormSection>
              <Inputs.Search
                name="hotel.name"
                placeholder="Name of hotel"
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
              <SDescriptorWrapper>
                <Inputs.Text name="group.name" placeholder="Group name" />
                <SInputDescriptor>
                  Optional: Enter if your hotel is part of a group
                </SInputDescriptor>
              </SDescriptorWrapper>
            </CreateAccountFormSection>
            <CreateAccountFormSection
              title="Hotel address"
              visible={state.isAddressChosen}
            >
              <CreateAccountFormSectionInputWrapper>
                <Inputs.Text
                  name="hotel.address.line1"
                  placeholder="Address line 1"
                />
                <Inputs.Text
                  name="hotel.address.line2"
                  placeholder="Address line 2"
                />
                <Inputs.Text
                  name="hotel.address.town"
                  placeholder="Town or city"
                />
                <Inputs.Text
                  name="hotel.address.postalCode"
                  placeholder="Postcode"
                />
                <Inputs.Search
                  ref={countrySearchRef}
                  data={searchCountries}
                  onClick={handleCountryClick}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  name="hotel.address.country"
                  placeholder="Country"
                  allowedValues={specificCountryList}
                />
              </CreateAccountFormSectionInputWrapper>
            </CreateAccountFormSection>
            <CreateAccountFormSection title="Website">
              <SDescriptorWrapper>
                <Inputs.Text name="hotel.website" placeholder="Website" />
              </SDescriptorWrapper>
            </CreateAccountFormSection>
            <CreateAccountFormSection title="Contact details">
              <CreateAccountFormSectionInputWrapper>
                <Inputs.Text
                  name="hotel.telephone"
                  placeholder="Hotel's contact number"
                />
              </CreateAccountFormSectionInputWrapper>
            </CreateAccountFormSection>
            <CreateAccountFormSection
              title="Job title"
              description="This helps us tailor your experience "
            >
              <Inputs.Text
                name="user.jobTitle"
                placeholder="Tell us your job title"
              />
            </CreateAccountFormSection>
            <CreateAccountFormSection>
              <SNextButton buttonStyle="primary">Next</SNextButton>
            </CreateAccountFormSection>
          </SFormWrapper>
          <SReviewWrapper display={state.isReviewOpen}>
            <SReviewSectionWrapper>
              <SReviewSectionTitle>Hotel</SReviewSectionTitle>
              <SReviewInformation>
                {state.formValues?.hotel.name}
              </SReviewInformation>
              <SReviewInformation>
                {state.formValues?.hotel.address.line1}
                <br />
                {state.formValues?.hotel.address.line2}
                <br />
                {state.formValues?.hotel.address.town}
                <br />
                {state.formValues?.hotel.address.postalCode}
                <br />
                {state.formValues?.hotel.address.country}
              </SReviewInformation>
            </SReviewSectionWrapper>
            {state.formValues?.group?.name ? (
              <SReviewSectionWrapper>
                <SReviewSectionTitle>Group</SReviewSectionTitle>
                <SReviewInformation>
                  {state.formValues?.group.name}
                </SReviewInformation>
              </SReviewSectionWrapper>
            ) : null}
            <SReviewSectionWrapper>
              <SReviewSectionTitle>Website</SReviewSectionTitle>
              <Link interactive>{state.formValues?.hotel.website}</Link>
            </SReviewSectionWrapper>
            <SReviewSectionWrapper>
              <SReviewSectionTitle>Contact Details</SReviewSectionTitle>
              <SReviewInformation>
                {state.formValues?.hotel.telephone}
                <br />
                {state.formValues?.user.mobile}
              </SReviewInformation>
            </SReviewSectionWrapper>
            <SReviewSectionWrapper>
              <SReviewSectionTitle>
                Your role at {state.formValues?.hotel.name}
              </SReviewSectionTitle>
              <SReviewInformation>
                {state.formValues?.user.jobTitle}
              </SReviewInformation>
            </SReviewSectionWrapper>
            <SActionWrapper>
              <Link
                onClick={() => setState((s) => ({ ...s, isReviewOpen: false }))}
                disableOnClick={false}
              >
                Edit
              </Link>
              <Button buttonStyle="primary" onClick={submitForm}>
                Confirm
              </Button>
            </SActionWrapper>
          </SReviewWrapper>
        </Form.Provider>
      </FormContext>
    </CreateAccountForm>
  );
};
