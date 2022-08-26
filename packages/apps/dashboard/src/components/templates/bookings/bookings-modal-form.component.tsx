import { Booking, BookingStatus, CustomFieldType } from '@hm/sdk';
import { Link, Row, Text } from '@src/components/atoms';
import { CountryPicker, Inputs } from '@src/components/molecules';
import { BookingsFilter, Form } from '@src/components/templates';
import countryData from '@src/components/templates/create-account/country-data.json';
import { theme } from '@src/components/theme';
import { validationResolver } from '@src/util/form';
import { useIsPMSActive } from '@src/util/integrations';
import { useHotel } from '@src/xhr/query';
import * as CountryCodes from 'country-code-info';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import React, { useMemo, useState } from 'react';
import { FormContext, useFieldArray, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { layout, LayoutProps, space, SpaceProps } from 'styled-system';
import * as z from 'zod';

dayjs.extend(isBetween);
dayjs.extend(utc);

const getCountry = (query: string | undefined) => {
  return countryData.find(
    (country) => country.countryCode === query || country.name === query
  );
};

const STextInput = styled(Inputs.Text).attrs({
  fontWeight: 'semibold',
  labelStyle: { color: theme.textColors.lightGray, padding: 0 },
  wrapperStyle: {
    paddingLeft: 0,
    paddingTop: 0,
    margin: 0,
  },
  labelWrapperStyle: { marginBottom: 0 },
  embedded: true,
})`
  padding-left: 0;
`;

const SCustomFieldToggleInput = styled(Inputs.Search).attrs({
  fontWeight: 'semibold',
  labelStyle: { color: theme.textColors.lightGray, padding: 0 },
  wrapperStyle: {
    paddingLeft: 0,
    paddingTop: 0,
    margin: 0,
  },
  labelWrapperStyle: { marginBottom: 0 },
  embedded: true,
})`
  padding-left: 0;
`;

const SFormBookingWrapper = styled.div<SpaceProps & LayoutProps>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;

  ${space};
  ${layout};

  ${theme.mediaQueries.tablet} {
    grid-template-columns: 1fr;
  }
`;

const SLine = styled.div`
  margin-top: 8px;
  background-color: ${theme.colors.lightGray};
  height: 0.1px;
`;

const SPartyNumberWrapper = styled.div`
  user-select: none;
`;

const SPhoneNumberWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: baseline;
`;

const SFooter = styled.div`
  position: sticky;
  bottom: 0;
  background: #fff;
  z-index: 1;
  padding: 16px 0;
`;

const formSchema = z.object({
  estimatedTimeOfArrival: z.string().optional(),
  bookingDetails: z.object({
    toggleQuestion: z.array(
      z.object({
        title: z.string().nullish(),
        type: z.nativeEnum(CustomFieldType).nullish(),
        result: z.string().nullish(),
        toggle: z.string().nullish(),
      })
    ),
  }),
  purposeOfStay: z.string().optional(),
  party: z
    .array(
      z.object({
        specialOccasions: z.string().optional(),
        firstName: z.string().nonempty(),
        lastName: z.string().nonempty(),
        dateOfBirth: z
          .string()
          .optional()
          .transform((date) => dayjs(date).utc(true).startOf('day').toDate()),
        passportNumber: z.string().optional(),
        mobile: z.string().optional(),
        email: z.string().nonempty(),
        address: z.string().optional(),
        countryOfResidence: z.string().optional(),
        nationality: z.string().optional(),
        nextDestination: z.string().optional(),
        job: z.string().optional(),
        company: z.string().optional(),
        dietaryRequirements: z.string().optional(),
      })
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export interface BookingsModalFormValues extends FormValues {
  closeModal?: boolean;
}

interface Props {
  booking?: Booking;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (
    formValues: BookingsModalFormValues,
    updateStatus?: boolean
  ) => void;
}

enum MewsPurposeOfStay {
  Leisure = 'Leisure',
  Business = 'Business',
  Student = 'Student',
}

enum ApaleoPurposeOfStay {
  Leisure = 'Leisure',
  Business = 'Business',
}

export const BookingsModalForm: React.FC<Props> = ({
  booking,
  loading,
  onCancel,
  onSubmit,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isEditVisible, setIsEditVisible] = useState(false);

  const { data: hotel } = useHotel(false);

  const formMethods = useForm<FormValues>({
    validationContext: formSchema,
    validationResolver: validationResolver,
    defaultValues: (booking?.party?.length
      ? {
          ...booking,
          party: booking.party.map((guest) => ({
            ...guest,
            countryOfResidence: getCountry(guest.countryOfResidence as string)
              ?.name,
            dateOfBirth: guest.dateOfBirth
              ? dayjs(guest.dateOfBirth)
                  .utc(true)
                  .startOf('day')
                  .format('YYYY-MM-DD')
              : undefined,
            nationality: getCountry(guest.nationality as string)?.name,
            nextDestination: getCountry(guest.nextDestination as string)?.name,
          })),
          bookingDetails: {
            toggleQuestion: booking.bookingDetails?.toggleQuestion.map(
              (customField) => {
                if (customField.type === CustomFieldType.Boolean) {
                  return {
                    ...customField,
                    toggle: customField.toggle ? 'Yes' : 'No',
                  };
                }
                return customField;
              }
            ),
          },
        }
      : { ...booking, party: [] }) as FormValues,
  });

  const isPMSActive = useIsPMSActive();

  const purposeOfStayOptions = useMemo(() => {
    if (hotel?.integrations?.mews) {
      return [
        MewsPurposeOfStay.Business,
        MewsPurposeOfStay.Leisure,
        MewsPurposeOfStay.Student,
      ];
    } else if (hotel?.group.integrations?.apaleo) {
      return [ApaleoPurposeOfStay.Business, ApaleoPurposeOfStay.Leisure];
    }
    return [];
  }, [hotel?.integrations?.mews, hotel?.group.integrations?.apaleo]);

  const handleSubmit = (
    formValues: BookingsModalFormValues,
    updateStatus?: boolean
  ) => {
    const party = formValues.party?.map((guest) => {
      return {
        ...guest,
        countryOfResidence: getCountry(guest.countryOfResidence)?.countryCode,
        nationality: getCountry(guest.nationality)?.countryCode,
        nextDestination: getCountry(guest.nextDestination)?.countryCode,
      };
    });

    onSubmit(
      {
        ...formValues,
        party,
      },
      updateStatus
    );
  };

  const handleSaveBooking = () => {
    setIsEditVisible((s) => !s);

    if (!isEditVisible) {
      return;
    }

    const formValues: Record<string, any> = { ...formMethods.getValues() };
    formValues.party = [];

    Object.entries(formValues).forEach(([key, value]) => {
      if (/party\[\d\]/.test(key)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, idx, partyKey] = key!.match(/party\[(\d)\]\.(.*)/)!;

        if (!formValues.party?.[idx]) {
          formValues.party[idx] = {};
        }
        formValues.party[idx][partyKey] = value;

        delete formValues[key];
      }

      if (/bookingDetails.toggleQuestion\[\d\]/.test(key)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, idx, customFieldKey] = key!.match(
          /bookingDetails.toggleQuestion\[(\d)\]\.(.*)/
        )!;

        if (!formValues.bookingDetails) {
          formValues.bookingDetails = {
            toggleQuestion: [
              ...(booking?.bookingDetails?.toggleQuestion || []),
            ],
          };
        }

        formValues.bookingDetails.toggleQuestion[idx][customFieldKey] =
          formValues.bookingDetails.toggleQuestion[idx].type ===
          CustomFieldType.Boolean
            ? value === 'Yes'
              ? true
              : false
            : value;

        delete formValues[key];
      }
    });

    handleSubmit(
      {
        ...formValues,
        closeModal: false,
      } as BookingsModalFormValues,
      false
    );
  };

  const { fields } = useFieldArray({
    name: 'party',
    control: formMethods.control,
  });

  const { fields: customFields } = useFieldArray({
    name: 'bookingDetails.toggleQuestion',
    control: formMethods.control,
  });

  return (
    <FormContext {...formMethods}>
      <Form.Provider
        onSubmit={formMethods.handleSubmit((formValues) =>
          handleSubmit(formValues)
        )}
      >
        <Form.Section>
          <Row mt="16px" justifyContent="space-between" alignItems="center">
            <Text.BodyBold color={theme.textColors.lightGray}>
              App check-in
            </Text.BodyBold>
            <Link
              disableOnClick={false}
              fontWeight="semibold"
              onClick={() => handleSaveBooking()}
            >
              {!isEditVisible ? 'Edit' : 'Done'}
            </Link>
          </Row>

          <SLine />

          <SFormBookingWrapper>
            <STextInput
              disabled={!isEditVisible}
              label="Estimated time of arrival"
              name="estimatedTimeOfArrival"
              type="time"
            />

            <SPartyNumberWrapper>
              <Text.Body color={theme.textColors.lightGray} fontWeight="medium">
                No of guests
              </Text.Body>
              <Text.Body
                mt="4px"
                color={theme.textColors.lightGray}
                fontWeight="semibold"
              >
                {booking?.numberOfAdults
                  ? `${booking.numberOfAdults} adult${
                      booking.numberOfAdults > 1 ? 's' : ''
                    }`
                  : undefined}
                {booking?.numberOfChildren
                  ? `, ${booking.numberOfChildren} child${
                      booking.numberOfChildren > 1 ? 'ren' : ''
                    }`
                  : undefined}
              </Text.Body>
            </SPartyNumberWrapper>

            {isPMSActive ? (
              <SCustomFieldToggleInput
                onChange={() => undefined}
                onClick={(data) =>
                  formMethods.setValue('purposeOfStay', data.title)
                }
                name="purposeOfStay"
                data={purposeOfStayOptions.map((title) => ({ title }))}
                allowedValues={purposeOfStayOptions}
                disabled={!isEditVisible}
                label="Purpose of stay"
                showSearchIcon={false}
              />
            ) : (
              <STextInput
                disabled={!isEditVisible}
                placeholder="Not provided"
                label="Purpose of stay"
                name="purposeOfStay"
              />
            )}

            <STextInput
              disabled={!isEditVisible}
              placeholder="Not provided"
              label="Special Occasions"
              name="party[0].specialOccasions"
            />

            {customFields.map((customField, index) => {
              if (customField.type === CustomFieldType.String) {
                return (
                  <STextInput
                    key={index}
                    disabled={!isEditVisible}
                    placeholder="Not provided"
                    label={customField.title}
                    name={`bookingDetails.toggleQuestion[${index}].result`}
                  />
                );
              }

              return (
                <SCustomFieldToggleInput
                  onChange={() => undefined}
                  key={index}
                  onClick={(data) =>
                    formMethods.setValue(
                      `bookingDetails.toggleQuestion[${index}].toggle`,
                      data.title
                    )
                  }
                  name={`bookingDetails.toggleQuestion[${index}].toggle`}
                  data={[{ title: 'Yes' }, { title: 'No' }]}
                  allowedValues={['Yes', 'No']}
                  disabled={!isEditVisible}
                  label={customField.title}
                  showSearchIcon={false}
                />
              );
            })}
          </SFormBookingWrapper>
        </Form.Section>

        <Form.Section>
          <Row justifyContent="space-between" alignItems="center">
            <Text.BodyBold color={theme.textColors.lightGray}>
              Details {booking?.party && `(${booking?.party.length})`}
            </Text.BodyBold>
            <Link
              fontWeight="semibold"
              disableOnClick={false}
              onClick={() => handleSaveBooking()}
            >
              {!isEditVisible ? 'Edit' : 'Done'}
            </Link>
          </Row>
          {booking?.party && booking?.party?.length > 1 && (
            <BookingsFilter
              mt="8px"
              options={booking?.party?.map(
                (party) => `${party.firstName} ${party.lastName}`
              )}
              onChange={(name) => {
                const partyIndex =
                  booking.party?.findIndex(
                    (party) => name === `${party.firstName} ${party.lastName}`
                  ) || 0;
                setSelectedIndex(partyIndex);
              }}
              selected={`${booking.party[selectedIndex]?.firstName} ${booking.party[selectedIndex]?.lastName}`}
            />
          )}
          <SLine />
          {fields.map((field, index) => (
            <SFormBookingWrapper
              display={index !== selectedIndex ? 'none' : 'grid'}
              key={field.id}
              mt="16px"
              pb={booking?.dateCheckedIn ? '16px' : undefined}
            >
              <STextInput
                disabled={!isEditVisible}
                placeholder="Not provided"
                label="First name"
                name={`party[${index}].firstName`}
              />

              <STextInput
                disabled={!isEditVisible}
                placeholder="Not provided"
                label="Last name"
                name={`party[${index}].lastName`}
              />

              <STextInput
                disabled={!isEditVisible}
                type="date"
                label={
                  booking?.party?.[index].dateOfBirth &&
                  dayjs(booking.party[index].dateOfBirth)
                    .set('year', dayjs(booking?.checkInDate).get('year'))
                    .isBetween(
                      booking?.checkInDate,
                      booking?.checkOutDate,
                      null,
                      '[]'
                    )
                    ? 'Date of birth 🥳'
                    : 'Date of birth'
                }
                name={`party[${index}].dateOfBirth`}
              />

              <STextInput
                disabled={!isEditVisible}
                placeholder="Not provided"
                label="Passport number"
                name={`party[${index}].passportNumber`}
              />

              <div>
                <Text.Body
                  color={theme.textColors.lightGray}
                  mb="4px"
                  fontWeight="medium"
                >
                  Phone Number
                </Text.Body>
                <SPhoneNumberWrapper>
                  <Text.Body
                    pb="8px"
                    mr="2px"
                    color={theme.textColors.lightGray}
                    fontWeight="semibold"
                  >
                    +
                    {
                      CountryCodes.findCountry({
                        a2: booking?.party?.[0].mobileCountryCode || '',
                      })?.dial
                    }
                  </Text.Body>
                  <STextInput
                    placeholder="Not provided"
                    disabled={!isEditVisible}
                    name={`party[${index}].mobile`}
                  />
                </SPhoneNumberWrapper>
              </div>

              <STextInput
                disabled
                placeholder="Not provided"
                label="Email address"
                name={`party[${index}].email`}
              />

              <STextInput
                disabled={!isEditVisible}
                placeholder="Not provided"
                label="Address"
                name={`party[${index}].address`}
              />

              <CountryPicker
                disabled={!isEditVisible}
                embedded
                labelStyle={{ margin: 0, color: theme.textColors.lightGray }}
                wrapperStyle={{ paddingLeft: 0 }}
                fontWeight="semibold"
                label="Country of residence"
                name={`party[${index}].countryOfResidence`}
                minDropdownWidth="180px"
              />

              <CountryPicker
                disabled={!isEditVisible}
                embedded
                labelStyle={{ margin: 0, color: theme.textColors.lightGray }}
                wrapperStyle={{ paddingLeft: 0 }}
                fontWeight="semibold"
                label="Nationality"
                name={`party[${index}].nationality`}
                minDropdownWidth="180px"
              />

              <CountryPicker
                disabled={!isEditVisible}
                embedded
                labelStyle={{ margin: 0, color: theme.textColors.lightGray }}
                wrapperStyle={{ paddingLeft: 0 }}
                fontWeight="semibold"
                label="Next destination"
                name={`party[${index}].nextDestination`}
                minDropdownWidth="180px"
              />

              <STextInput
                disabled={!isEditVisible}
                placeholder="Not provided"
                label="Job"
                name={`party[${index}].job`}
              />

              <STextInput
                disabled={!isEditVisible}
                placeholder="Not provided"
                label="Company"
                name={`party[${index}].company`}
              />

              <STextInput
                disabled={!isEditVisible}
                placeholder="Not provided"
                label="Dietary requirements"
                name={`party[${index}].dietaryRequirements`}
              />
            </SFormBookingWrapper>
          ))}
        </Form.Section>

        {!booking?.dateCheckedIn &&
        booking?.status !== BookingStatus.Created ? (
          <SFooter>
            <Form.Submit
              onCancel={onCancel}
              cancelText="Review later"
              loading={loading}
              disabled={
                booking?.status === BookingStatus.Reviewed
                  ? dayjs().isBefore(booking?.checkInDate)
                  : false
              }
            >
              {booking?.status === BookingStatus.Submitted
                ? 'Looks good'
                : 'Arrived'}
            </Form.Submit>
          </SFooter>
        ) : null}
      </Form.Provider>
    </FormContext>
  );
};
