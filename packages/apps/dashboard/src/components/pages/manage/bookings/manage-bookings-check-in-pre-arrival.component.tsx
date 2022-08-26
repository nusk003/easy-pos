import { BookingsSettings, ReminderDurationType } from '@hm/sdk';
import { Button, Text } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import {
  BookingEmailTemplate,
  ManageBookingsCheckInCustomFields,
  ManageBookingsCheckInProgressButtons,
  ManageBookingsCheckInReminderFields,
  ManageBookingsCheckInTermsFields,
  Form,
  ManageFormSection,
} from '@src/components/templates';
import { theme } from '@src/components/theme';
import { useStore } from '@src/store';
import { validationResolver } from '@src/util/form';
import { validateUrl } from '@src/util/validations';
import { useHotel } from '@src/xhr/query';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { MdLabel } from 'react-icons/md';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';
import * as z from 'zod';

const SInputGrid = styled.div<SpaceProps>`
  display: grid;
  grid-template-columns: max-content auto;
  gap: 16px;
  align-items: flex-start;
  ${space}
`;

const SFieldsWrapper = styled.div`
  display: grid;
  gap: 16px;
`;

const SRequiredLabelText = styled(Text.Body)`
  display: grid;
  grid-auto-flow: column;
  gap: 4px;
  align-items: center;
  justify-content: left;
  font-weight: ${(props) => props.theme.fontWeights.medium};
`;

const SRequiredLabel = styled(MdLabel)`
  fill: ${theme.colors.blue};
`;

export const guestFieldsSchema = {
  name: z.boolean(),
  countryOfResidence: z.boolean(),
  address: z.boolean(),
  nationality: z.boolean(),
  passportNumber: z.boolean(),
  foreignNationalPassportNumber: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  mobile: z.boolean(),
  email: z.boolean(),
  dateOfBirth: z.boolean(),
  dietaryRequirements: z.boolean(),
};

const childFieldsSchema = z.object({}).extend(guestFieldsSchema);

const adultFieldsSchema = z
  .object({
    nextDestination: z.boolean(),
    foreignNationalNextDestination: z
      .string()
      .transform((val) => {
        return val === 'true';
      })
      .optional(),
    job: z.boolean(),
    company: z.boolean(),
  })
  .extend(guestFieldsSchema);

const partyFieldsSchema = z.object({
  adult: adultFieldsSchema,
  child: childFieldsSchema,
});

const customFieldSchema = z.object({
  title: z.string(),
  type: z.string(),
});

const fieldsSchema = z
  .object({
    bookingReference: z.boolean(),
    name: z.boolean(),
    datesOfStay: z.boolean(),
    estimatedTimeOfArrival: z.boolean(),
    numberOfAdults: z.boolean(),
    numberOfChildren: z.boolean(),
    clubMemberNumber: z.boolean(),
    passportNumber: z.boolean(),
    foreignNationalPassportNumber: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
    countryOfResidence: z.boolean(),
    address: z.boolean(),
    nationality: z.boolean(),
    foreignNationalNextDestination: z
      .string()
      .transform((val) => Boolean(val))
      .optional(),
    customFields: z
      .array(customFieldSchema)
      .or(z.boolean())
      .transform((val) => {
        if (Array.isArray(val)) {
          return val;
        }
        if (typeof val === 'boolean') {
          if (val) {
            return [];
          }
        }
        return null;
      })
      .optional()
      .nullable(),
    dateOfBirth: z.boolean(),
    dietaryRequirements: z.boolean(),
    purposeOfStay: z.boolean().optional().nullable(),
    specialOccasions: z.boolean(),
    job: z.boolean(),
    company: z.boolean(),
    passportScan: z.boolean(),
    party: partyFieldsSchema,
  })
  .partial();

const formSchema = z.object({
  preArrival: z.object({
    email: z.boolean(),
    minHoursBeforeCheckIn: z
      .string()
      .refine((val) => !!val, 'Please enter a number')
      .transform((val) => {
        return Number(val);
      }),
    notifications: z
      .object({
        reminders: z
          .array(
            z.object({
              value: z
                .string()
                .refine((val) => !!val, 'Please enter a number')
                .transform((val) => {
                  return Number(val);
                }),
              duration: z.nativeEnum(ReminderDurationType),
            })
          )
          .or(z.undefined()),
      })
      .optional(),
    fields: fieldsSchema,
    terms: z
      .array(
        z.object({
          message: z.string(),
          link: z
            .string()
            .nonempty('Please enter a link to your terms')
            .refine(validateUrl, 'Please enter a valid URL'),
        })
      )
      .optional(),
  }),
});

export type ManageBookingsCheckInPreArrivalFormValues = z.infer<
  typeof formSchema
>;

interface Props {
  onUpdate: (formValues: ManageBookingsCheckInPreArrivalFormValues) => void;
}

export const ManageBookingsCheckInPreArrival: React.FC<Props> = ({
  onUpdate,
}) => {
  const history = useHistory();
  const { state } = useLocation<{ bookingsSettings: BookingsSettings }>();

  const { data: hotel } = useHotel();

  const { bookingsSettings } = useStore(
    useCallback(
      ({ bookingsSettings }) => ({
        bookingsSettings,
      }),
      []
    )
  );

  const [isBookingEmailTemplateVisible, setIsBookingEmailTemplateVisible] =
    useState(false);

  const defaultValues = useMemo(() => {
    if (!bookingsSettings?.preArrival) {
      return {
        preArrival: {
          fields: {
            name: true,
            bookingReference: true,
            datesOfStay: true,
          },
        },
      };
    }

    const { purposeOfStay, customFields, party } =
      bookingsSettings?.preArrival?.fields;
    const adult = party?.adult;
    const child = party?.child;
    const { notifications, terms } = bookingsSettings.preArrival;
    return {
      preArrival: {
        ...bookingsSettings?.preArrival,
        notifications: {
          ...notifications,
          reminders: notifications?.reminders
            ? notifications.reminders
            : undefined,
        },
        terms: terms ? terms : undefined,
        fields: {
          ...bookingsSettings?.preArrival.fields,
          foreignNationalPassportNumber: String(
            bookingsSettings.preArrival.fields.foreignNationalPassportNumber
          ),
          party: {
            ...party,
            adult: {
              ...adult,
              foreignNationalNextDestination: String(
                adult?.foreignNationalNextDestination
              ),
              foreignNationalPassportNumber: String(
                adult?.foreignNationalPassportNumber
              ),
            },
            child: {
              ...child,
              foreignNationalPassportNumber: String(
                child?.foreignNationalPassportNumber
              ),
            },
          },
          purposeOfStay: purposeOfStay ? purposeOfStay : undefined,
          customFields: customFields ? customFields : undefined,
        },
      },
    };
  }, [bookingsSettings]);

  const formMethods = useForm<ManageBookingsCheckInPreArrivalFormValues>({
    defaultValues: defaultValues as ManageBookingsCheckInPreArrivalFormValues,
    validationContext: formSchema,
    validationResolver: validationResolver,
  });

  const onSubmit = async (
    formValues: ManageBookingsCheckInPreArrivalFormValues
  ) => {
    if (!formValues.preArrival.notifications) {
      formValues.preArrival.notifications = {};
    }

    await onUpdate(formValues);

    if (!hotel?.bookingsSettings) {
      history.push('/manage/bookings/arrival', {
        bookingsSettings: { ...bookingsSettings, ...formValues },
      });
    }
  };

  useEffect(() => {
    if (
      hotel &&
      !hotel.bookingsSettings &&
      !bookingsSettings &&
      !state?.bookingsSettings
    ) {
      history.push('/manage/bookings');
    }
  }, [bookingsSettings, history, hotel, state?.bookingsSettings]);

  const watchNumberOfGuests =
    formMethods.watch('preArrival.fields.numberOfAdults') ||
    formMethods.watch('preArrival.fields.numberOfChildren');

  return (
    <FormContext {...formMethods}>
      <Form.Provider onSubmit={formMethods.handleSubmit(onSubmit)}>
        <ManageFormSection
          title="Automated notifications"
          description="Automate your app check-in messaging and reminders to guests ahead of their arrival"
        >
          <div>
            <Text.Body mb="4px">Reminders</Text.Body>
            <Text.Descriptor>
              Guests will be sent a sequence of app check-in notifications as
              automated below until completed or dismissed
            </Text.Descriptor>

            <ManageBookingsCheckInReminderFields name="preArrival.notifications.reminders" />
          </div>
        </ManageFormSection>

        <ManageFormSection
          title="Email"
          description="View automated email communications with your guests regarding app check-in"
        >
          <div>
            <Inputs.Checkbox
              toggle
              name="preArrival.email"
              sideLabel="Check-in Email"
            />
            <Text.Body mt="16px" mb="4px">
              View email template
            </Text.Body>
            <Text.Descriptor mb="16px">
              Guests will automatically be sent this email inviting them to
              check-in via your app ahead of their arrival, following the
              reminder settings above. Emails are automatically sent to
              guests&apos; email addresses found in the PMS or what you enter
              manually.
            </Text.Descriptor>
            <Button
              buttonStyle="secondary"
              mb="16px"
              type="button"
              onClick={() => setIsBookingEmailTemplateVisible(true)}
            >
              View email example
            </Button>
            <BookingEmailTemplate
              visible={isBookingEmailTemplateVisible}
              onClose={() => setIsBookingEmailTemplateVisible(false)}
            />
            <Text.Descriptor mb="16px">
              We don&apos;t offer the ability to edit email templates right now.
              We&apos;ll let you know as soon as this is available.
            </Text.Descriptor>
            <Text.Descriptor>
              Tip: We recommend reviewing any existing emails you already send
              out and tweak if necessary to streamline your communications and
              make sure there will be no confusion.
            </Text.Descriptor>
          </div>
        </ManageFormSection>

        <ManageFormSection
          title="App check-in"
          description="Manage the entire app check-in process for your guests"
        >
          <Inputs.Text
            name="preArrival.minHoursBeforeCheckIn"
            label="App check-in cut-off point"
            note="Set the latest time that guests can check-in via the app"
            sideLabel="hours before general check-in time (6pm)"
            width="30px"
            mask="999"
          />
          <div>
            <Text.Body mb="tiny">App check-in registration</Text.Body>
            <Text.Descriptor>
              Guests will need to go through and complete the following fields
            </Text.Descriptor>
          </div>
          <Text.Descriptor>Booking details</Text.Descriptor>

          {/* ---- Booking Details ---- */}
          <SFieldsWrapper>
            <SInputGrid>
              <Inputs.Checkbox
                toggle
                disabled
                name="preArrival.fields.bookingReference"
              />
              <div>
                <SRequiredLabelText>
                  Booking reference
                  <SRequiredLabel />
                </SRequiredLabelText>
                <Text.Descriptor>
                  This will be pre-filled if the information is already
                  available
                </Text.Descriptor>
              </div>
            </SInputGrid>

            <SInputGrid>
              <Inputs.Checkbox toggle disabled name="preArrival.fields.name" />
              <div>
                <SRequiredLabelText>
                  Name
                  <SRequiredLabel />
                </SRequiredLabelText>
                <Text.Descriptor>
                  This will be pre-filled if the information is already
                  available
                </Text.Descriptor>
              </div>
            </SInputGrid>

            <SInputGrid>
              <Inputs.Checkbox
                toggle
                disabled
                name="preArrival.fields.datesOfStay"
              />
              <div>
                <SRequiredLabelText>
                  Dates of stay
                  <SRequiredLabel />
                </SRequiredLabelText>
                <Text.Descriptor>
                  This will be pre-filled if the information is already
                  available
                </Text.Descriptor>
              </div>
            </SInputGrid>

            <Inputs.Checkbox
              name="preArrival.fields.estimatedTimeOfArrival"
              sideLabel="Estimated time of arrival"
              toggle
            />

            <SInputGrid>
              <Inputs.Checkbox
                toggle
                noRegister
                name="preArrival.fields.numberOfGuests"
                defaultValue={watchNumberOfGuests as boolean}
                onClick={(e) => {
                  formMethods.setValue('preArrival.fields.numberOfAdults', e);
                  formMethods.setValue('preArrival.fields.numberOfChildren', e);
                }}
              />
              <div>
                <Text.Body mt="4px">Number of guests</Text.Body>
                <div
                  style={{ display: watchNumberOfGuests ? 'block' : 'none' }}
                >
                  <Inputs.Checkbox
                    key="preArrival.fields.numberOfAdults"
                    name="preArrival.fields.numberOfAdults"
                    sideLabel="Adults"
                    mt={16}
                  />
                  <Inputs.Checkbox
                    key="preArrival.fields.numberOfChildren"
                    name="preArrival.fields.numberOfChildren"
                    sideLabel="Children"
                    mt="tiny"
                  />
                </div>
              </div>
            </SInputGrid>

            <Inputs.Checkbox
              name="preArrival.fields.clubMemberNumber"
              sideLabel="Club member number"
              toggle
            />
          </SFieldsWrapper>

          {/* ---- Personal Details ---- */}
          <SFieldsWrapper>
            <Text.Descriptor>Personal Details</Text.Descriptor>

            <Inputs.Checkbox
              name="preArrival.fields.countryOfResidence"
              sideLabel="Country of residence"
              toggle
            />

            <Inputs.Checkbox
              name="preArrival.fields.address"
              sideLabel="Address"
              toggle
            />

            <Inputs.Checkbox
              name="preArrival.fields.nationality"
              sideLabel="Nationality"
              toggle
            />

            <SInputGrid>
              <Inputs.Checkbox toggle name="preArrival.fields.passportNumber" />
              <div>
                <Text.Body mt="4px">Passport Number</Text.Body>
                {formMethods.watch('preArrival.fields.passportNumber') ? (
                  <>
                    <Inputs.Radio
                      mt={16}
                      name="preArrival.fields.foreignNationalPassportNumber"
                      data="true"
                      sideLabel="Only if foreign national"
                    />
                    <Inputs.Radio
                      name="preArrival.fields.foreignNationalPassportNumber"
                      data="false"
                      sideLabel="Regardless of nationality"
                      mt="tiny"
                    />
                  </>
                ) : null}
              </div>
            </SInputGrid>

            <SInputGrid>
              <Inputs.Checkbox
                mr="0px"
                toggle
                name="preArrival.fields.customFields"
                onClick={(e) => {
                  formMethods.setValue(
                    'preArrival.fields.customFields',
                    e ? [] : false
                  );
                }}
                defaultValue={
                  !!formMethods.watch('preArrival.fields.customFields')
                }
              />
              <div>
                <Text.Body mt="4px">Custom Fields</Text.Body>

                {formMethods.watch('preArrival.fields.customFields') ? (
                  <ManageBookingsCheckInCustomFields name="preArrival.fields.customFields" />
                ) : null}
              </div>
            </SInputGrid>
          </SFieldsWrapper>

          {/* ---- Personalization Details ---- */}
          <SFieldsWrapper>
            <Text.Descriptor>Personalization Details</Text.Descriptor>

            <Inputs.Checkbox
              name="preArrival.fields.dateOfBirth"
              sideLabel="Date of birth"
              toggle
            />

            <Inputs.Checkbox
              name="preArrival.fields.dietaryRequirements"
              sideLabel="Dietary requirements or allergies"
              toggle
            />

            <Inputs.Checkbox
              toggle
              sideLabel="Purpose of stay"
              name="preArrival.fields.purposeOfStay"
            />

            <Inputs.Checkbox
              name="preArrival.fields.specialOccasions"
              sideLabel="Any special occasions during stay"
              toggle
            />

            <Inputs.Checkbox
              name="preArrival.fields.job"
              sideLabel="Job"
              toggle
            />

            <Inputs.Checkbox
              name="preArrival.fields.company"
              sideLabel="Company"
              toggle
            />

            <div>
              <Text.Body>Passport scan</Text.Body>
              <Text.Descriptor mt="4px">
                Guests will see a passport scan functionality on your app
                check-in interface to automatically fill required fields
              </Text.Descriptor>
            </div>
            <Inputs.Checkbox name="preArrival.fields.passportScan" toggle />
            <div>
              <Text.Descriptor>
                Privacy note: Each passport scan done by guests is discarded
                once the details have been used to automatically populate
                fields. We currently do not store passport scans on the Cloud
                Console.
              </Text.Descriptor>
            </div>
          </SFieldsWrapper>

          {/* ---- Adult Details ----  */}
          <SFieldsWrapper>
            <div>
              <Text.Body>Multiple adult guests</Text.Body>
              <Text.Descriptor mt="4px">
                For bookings with more than one adult, the following details are
                also collected about the other guests
              </Text.Descriptor>
            </div>

            <Inputs.Checkbox
              disabled
              name="preArrival.fields.party.adult.name"
              sideLabel="Name"
              toggle
            />

            <Inputs.Checkbox
              disabled
              name="preArrival.fields.party.adult.countryOfResidence"
              sideLabel="Country of residence"
              toggle
            />
            <Inputs.Checkbox
              disabled
              name="preArrival.fields.party.adult.nationality"
              sideLabel="Nationality"
              toggle
            />

            <Inputs.Checkbox
              disabled
              name="preArrival.fields.party.adult.address"
              sideLabel="Address"
              toggle
            />

            <SInputGrid>
              <Inputs.Checkbox
                toggle
                name="preArrival.fields.party.adult.passportNumber"
              />
              <div>
                <Text.Body mt="4px">Passport Number</Text.Body>
                {formMethods.watch(
                  'preArrival.fields.party.adult.passportNumber'
                ) ? (
                  <>
                    <Inputs.Radio
                      mt={16}
                      name="preArrival.fields.party.adult.foreignNationalPassportNumber"
                      data="true"
                      sideLabel="Only if foreign national"
                    />
                    <Inputs.Radio
                      name="preArrival.fields.party.adult.foreignNationalPassportNumber"
                      data="false"
                      sideLabel="Regardless of nationality"
                      mt="tiny"
                    />
                  </>
                ) : null}
              </div>
            </SInputGrid>

            <Inputs.Checkbox
              name="preArrival.fields.party.adult.mobile"
              sideLabel="Mobile"
              toggle
            />

            <Inputs.Checkbox
              name="preArrival.fields.party.adult.email"
              sideLabel="Email address"
              toggle
            />

            <SInputGrid>
              <Inputs.Checkbox
                toggle
                name="preArrival.fields.party.adult.nextDestination"
              />
              <div>
                <Text.Body mt="4px">Details of next destination</Text.Body>
                {formMethods.watch(
                  'preArrival.fields.party.adult.nextDestination'
                ) ? (
                  <>
                    <Inputs.Radio
                      mt={16}
                      name="preArrival.fields.party.adult.foreignNationalNextDestination"
                      data="true"
                      sideLabel="Only if foreign national"
                    />
                    <Inputs.Radio
                      name="preArrival.fields.party.adult.foreignNationalNextDestination"
                      data="false"
                      sideLabel="Regardless of nationality"
                      mt="tiny"
                    />
                  </>
                ) : null}
              </div>
            </SInputGrid>

            <Inputs.Checkbox
              name="preArrival.fields.party.adult.dateOfBirth"
              sideLabel="Date of birth"
              toggle
            />

            <Inputs.Checkbox
              name="preArrival.fields.party.adult.dietaryRequirements"
              sideLabel="Dietary requirements or allergies"
              toggle
            />

            <Inputs.Checkbox
              name="preArrival.fields.party.adult.job"
              sideLabel="Job"
              toggle
            />

            <Inputs.Checkbox
              name="preArrival.fields.party.adult.company"
              sideLabel="Company"
              toggle
            />
          </SFieldsWrapper>

          {/* ---- Children Details ---- */}
          <SFieldsWrapper>
            <div>
              <Text.Body>Multiple child guests</Text.Body>
              <Text.Descriptor mt="4px">
                For bookings with more than one child, the following details are
                also collected about the other guests
              </Text.Descriptor>
            </div>

            <Inputs.Checkbox
              disabled
              name="preArrival.fields.party.child.name"
              sideLabel="Name"
              toggle
            />
            <Inputs.Checkbox
              disabled
              name="preArrival.fields.party.child.countryOfResidence"
              sideLabel="Country of residence"
              toggle
            />
            <Inputs.Checkbox
              disabled
              name="preArrival.fields.party.child.nationality"
              sideLabel="Nationality"
              toggle
            />

            <Inputs.Checkbox
              disabled
              name="preArrival.fields.party.child.address"
              sideLabel="Address"
              toggle
            />

            <SInputGrid>
              <Inputs.Checkbox
                toggle
                name="preArrival.fields.party.child.passportNumber"
              />
              <div>
                <Text.Body mt="4px">Passport Number</Text.Body>
                {formMethods.watch(
                  'preArrival.fields.party.child.passportNumber'
                ) ? (
                  <>
                    <Inputs.Radio
                      mt={16}
                      name="preArrival.fields.party.child.foreignNationalPassportNumber"
                      data="true"
                      sideLabel="Only if foreign national"
                    />
                    <Inputs.Radio
                      name="preArrival.fields.party.child.foreignNationalPassportNumber"
                      data="false"
                      sideLabel="Regardless of nationality"
                      mt="tiny"
                    />
                  </>
                ) : null}
              </div>
            </SInputGrid>

            <Inputs.Checkbox
              name="preArrival.fields.party.child.mobile"
              sideLabel="Mobile"
              toggle
            />

            <Inputs.Checkbox
              name="preArrival.fields.party.child.email"
              sideLabel="Email address"
              toggle
            />

            <Inputs.Checkbox
              name="preArrival.fields.party.child.dateOfBirth"
              sideLabel="Date of birth"
              toggle
            />

            <Inputs.Checkbox
              name="preArrival.fields.party.child.dietaryRequirements"
              sideLabel="Dietary requirements or allergies"
              toggle
            />
          </SFieldsWrapper>

          <div>
            <Text.Body mt="16px">Terms and agreements</Text.Body>
            <Text.Descriptor mt="4px">
              Guests will be shown this terms or agreement notice and will have
              to tick to agree before they can complete their app check-in
            </Text.Descriptor>
            <ManageBookingsCheckInTermsFields name="preArrival.terms" />
          </div>
        </ManageFormSection>

        <ManageBookingsCheckInProgressButtons
          onCancel={() => {
            history.push('/manage/bookings');
          }}
        />
      </Form.Provider>
    </FormContext>
  );
};
