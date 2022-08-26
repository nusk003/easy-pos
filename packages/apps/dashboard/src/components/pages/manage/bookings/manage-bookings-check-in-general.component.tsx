import { Badge, Grid, Link, Text } from '@src/components/atoms';
import { Card, Inputs } from '@src/components/molecules';
import {
  ManageBookingsCheckInProgressButtons,
  Form,
  ManageFormSection,
} from '@src/components/templates';
import { theme } from '@src/components/theme';
import { useStore } from '@src/store';
import { validationResolver } from '@src/util/form';
import React, { useCallback, useMemo } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';
import * as z from 'zod';
import { ReactComponent as IntegrationIcon } from '@src/assets/icons/integration.icon.svg';
import { ReactComponent as VerifiedIcon } from '@src/assets/icons/verified-rounded-icon.svg';
import { useIsPMSActive } from '@src/util/integrations';
import { useHotel } from '@src/xhr/query';

const SInputGrid = styled.div<SpaceProps>`
  display: grid;
  grid-template-columns: max-content auto;
  gap: 16px;
  align-items: flex-start;

  ${space}
`;

const SProcessItemWrapper = styled(Card).attrs({
  cardStyle: 'light-blue',
})`
  display: grid;
  grid-auto-flow: column;
  gap: 16px;
  align-items: center;
  justify-content: start;
`;

const SProcessWrapper = styled.div`
  display: grid;
  gap: 16px;
`;

interface Props {
  onUpdate: (bookingsSettings: ManageBookingsCheckInGeneralFormValues) => void;
}

const formSchema = z.object({
  enabled: z.boolean(),
  checkInTime: z.string().nonempty('Please enter the check-in time'),
  checkOutTime: z.string().nonempty('Please enter the check-out time'),
  maxNumberOfRooms: z
    .string()
    .refine((val) => !!val, 'Please enter a number')
    .transform((val) => {
      return Number(val);
    }),
  maxPartySize: z
    .string()
    .refine((val) => !!val, 'Please enter a number')
    .transform((val) => {
      return Number(val);
    }),
  contactMethods: z.object({
    appMessaging: z.boolean().optional().nullable(),
    phoneNumber: z.boolean().optional().nullable(),
    email: z.boolean().optional().nullable(),
  }),
});

export type ManageBookingsCheckInGeneralFormValues = z.infer<typeof formSchema>;

export const ManageBookingsCheckInGeneral: React.FC<Props> = ({ onUpdate }) => {
  const history = useHistory();

  const { data: hotel } = useHotel();

  const isPMSActive = useIsPMSActive();

  const { bookingsSettings } = useStore(
    useCallback(
      ({ bookingsSettings }) => ({
        bookingsSettings,
      }),
      []
    )
  );

  const defaultValues = useMemo(() => {
    if (!bookingsSettings?.contactMethods) {
      return {
        contactMethods: {
          appMessaging: true,
        },
      };
    }
    return {
      enabled: bookingsSettings?.enabled,
      checkInTime: bookingsSettings?.checkInTime,
      checkOutTime: bookingsSettings?.checkOutTime,
      contactMethods: bookingsSettings?.contactMethods,
      maxNumberOfRooms: bookingsSettings?.maxNumberOfRooms as number,
      maxPartySize: bookingsSettings?.maxPartySize as number,
    };
  }, [bookingsSettings]);

  const formMethods = useForm<ManageBookingsCheckInGeneralFormValues>({
    validationContext: formSchema,
    validationResolver: validationResolver,
    defaultValues,
  });

  const onSubmit = async (
    formValues: ManageBookingsCheckInGeneralFormValues
  ) => {
    await onUpdate(formValues);

    if (!hotel?.bookingsSettings) {
      history.push('/manage/bookings/pre-arrival', {
        bookingsSettings: { ...bookingsSettings, ...formValues },
      });
    }
  };

  return (
    <FormContext {...formMethods}>
      <Form.Provider onSubmit={formMethods.handleSubmit(onSubmit)}>
        <ManageFormSection
          title="Setup"
          description="Enable or disable booking services"
        >
          <Text.Body fontWeight="semibold">
            What would you like to set up?
          </Text.Body>
          <Inputs.Checkbox
            toggle
            name="enabled"
            boldSideLabel
            sideLabel="Enable online check-in via app"
            sideLabelDescription="A smoother pre-arrival and check-in experience for your guests, plus more efficient operations for you and your people"
          />
          <Inputs.Checkbox
            toggle
            noRegister
            disabled
            boldSideLabel
            sideLabel="Enable online check-out via app"
            sideLabelDescription="This is currently not available yet"
            name="checkOut"
          />
        </ManageFormSection>

        <ManageFormSection
          title="PMS Integration"
          description="Connect your PMS to Hotel Manager to automate your bookings workflow"
        >
          <div>
            <Grid
              gridAutoFlow="column"
              justifyContent="start"
              alignItems="center"
              gridGap="8px"
            >
              {isPMSActive ? (
                <>
                  <VerifiedIcon fill={theme.colors.green} />
                  <Text.Body fontWeight="semibold">
                    Your PMS is connected
                  </Text.Body>
                </>
              ) : (
                <>
                  <IntegrationIcon fill={theme.textColors.gray} />
                  <Text.Body fontWeight="semibold">
                    You have not configured your PMS yet
                  </Text.Body>
                </>
              )}
            </Grid>
            <Link
              interactive
              mt="8px"
              onClick={() => history.push('/manage/marketplace')}
            >
              {isPMSActive ? 'Manage' : 'Connect'} your PMS {'->'}
            </Link>
          </div>

          <Text.SmallHeading>How It Works</Text.SmallHeading>
          <SProcessWrapper>
            <SProcessItemWrapper>
              <Badge count={1} bg="blue" />
              <div>
                <Text.Interactive>Receive all bookings</Text.Interactive>
                <Text.Descriptor>
                  Once connected to your PMS, all bookings are fetched
                  automatically and loaded onto your Dashboard
                </Text.Descriptor>
              </div>
            </SProcessItemWrapper>

            <SProcessItemWrapper>
              <Badge count={2} bg="blue" />
              <div>
                <Text.Interactive>Automate communications</Text.Interactive>
                <Text.Descriptor>
                  Set up emails, notifications or reminders to be sent
                  automatically to your guests and invite them to check in ahead
                  of their arrival
                </Text.Descriptor>
              </div>
            </SProcessItemWrapper>

            <SProcessItemWrapper>
              <Badge count={3} bg="blue" />
              <div>
                <Text.Interactive>
                  Effortless and contactless check-in experience
                </Text.Interactive>
                <Text.Descriptor>
                  Guests can check-in easily in their own time and share all the
                  information you need, while you instantly browse all online
                  check-ins and get to know your guests before they arrive
                </Text.Descriptor>
              </div>
            </SProcessItemWrapper>
          </SProcessWrapper>
        </ManageFormSection>

        <ManageFormSection
          title="Check-in policies"
          description="Give information on how check-in works at your hotel"
        >
          <Inputs.Text
            type="time"
            width="60px"
            name="checkInTime"
            label="General check-in time"
            note="Guests can check-in from this time. They can see this check-in policy on your app."
            sideLabel="on the day of arrival"
          />
        </ManageFormSection>

        <ManageFormSection
          title="Check-out policies"
          description="Give information on how check-out works at your hotel"
        >
          <Inputs.Text
            type="time"
            width="60px"
            name="checkOutTime"
            label="General check-out time"
            note="Guests need to check-out by this time. They can see this check-out policy on your app."
            sideLabel="on the day of departure"
          />
        </ManageFormSection>

        <ManageFormSection
          title="Help"
          description="Give ways your guests can get your help if needed during the check-in or check-out journey on your app"
        >
          <div>
            <Text.Body mb="4px">Contact methods</Text.Body>
            <Text.Descriptor>
              Guests can reach out to you via the following methods if they need
              help or support when checking in or checking out via the app
            </Text.Descriptor>
          </div>
          <SInputGrid>
            <Inputs.Checkbox
              name="contactMethods.appMessaging"
              sideLabel="App Messaging"
            />
          </SInputGrid>

          <SInputGrid>
            <Inputs.Checkbox
              name="contactMethods.phoneNumber"
              sideLabel="Phone Number"
            />
          </SInputGrid>

          <SInputGrid>
            <Inputs.Checkbox sideLabel="Email" name="contactMethods.email" />
          </SInputGrid>
        </ManageFormSection>

        <ManageFormSection
          title="Party size"
          description="Control which bookings are presented with and are able to use app check-in or app check-out"
        >
          <div>
            <Text.Body mb="4px">Maximum number of rooms</Text.Body>
            <Text.Descriptor>
              Guests need to check-out by this time. They can see this check-out
              policy on your app.
            </Text.Descriptor>
          </div>
          <Inputs.Text
            width="60px"
            name="maxNumberOfRooms"
            label="Maximum number of rooms"
            note="Bookings with a number of rooms that exceeds this number cannot check-in or check-out via the app and should do so physically instead. The number of rooms will be as indicated by the PMS."
            mask="999"
          />
          <Inputs.Text
            width="60px"
            name="maxPartySize"
            label="Maximum party size"
            note="Bookings with a party size that exceeds this number of people cannot check-in or check-out via the app and should do so physically instead. Party sizes of bookings will be as indicated by the PMS or what you enter manually."
            mask="999"
          />
        </ManageFormSection>
        <ManageBookingsCheckInProgressButtons />
      </Form.Provider>
    </FormContext>
  );
};
