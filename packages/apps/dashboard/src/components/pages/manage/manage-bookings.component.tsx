import { BookingsSettings } from '@hm/sdk';
import { toast } from '@src/components/atoms';
import { ToggleDropdown } from '@src/components/molecules';
import {
  ManageBookingsCheckInArrival,
  ManageBookingsCheckInArrivalFormValues,
  ManageBookingsCheckInCustomization,
  ManageBookingsCheckInCustomizationFormValues,
  ManageBookingsCheckInDepartureFormValues,
  ManageBookingsCheckInGeneral,
  ManageBookingsCheckInGeneralFormValues,
  ManageBookingsCheckInPreArrival,
  ManageBookingsCheckInPreArrivalFormValues,
} from '@src/components/pages/manage/bookings';
import {
  Header,
  ManageBookingsCheckInMenuBar,
} from '@src/components/templates';
import { theme } from '@src/components/theme';
import { useStore } from '@src/store';
import { sdk } from '@src/xhr/graphql-request';
import { useHotel } from '@src/xhr/query';
import React, { useCallback, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import styled from 'styled-components';

const SWrapper = styled.div`
  background: #fafafa;
  margin-right: -16px;
`;

const SPagesWrapper = styled.div`
  min-height: calc(100vh - 192px);

  padding: 32px;

  display: grid;
  align-content: start;

  ${theme.mediaQueries.tablet} {
    padding: 16px;
    min-height: calc(100vh - 152px);
  }
`;

type FormValues =
  | ManageBookingsCheckInGeneralFormValues
  | ManageBookingsCheckInPreArrivalFormValues
  | ManageBookingsCheckInArrivalFormValues
  | ManageBookingsCheckInDepartureFormValues
  | ManageBookingsCheckInCustomizationFormValues;

export const ManageBookings: React.FC = () => {
  const { data: hotel, mutate: mutateHotel } = useHotel();

  const history = useHistory();

  const { bookingsSettings, setBookingsSettings } = useStore(
    useCallback(
      ({ setBookingsSettings, bookingsSettings }) => ({
        bookingsSettings,
        setBookingsSettings,
      }),
      []
    )
  );

  const updateSettings = useCallback(
    async (bookingsSettings: BookingsSettings, onSuccess?: () => void) => {
      const toastId = toast.loader('Updating booking settings');
      try {
        await sdk.updateHotel({
          data: {
            bookingsSettings: {
              ...bookingsSettings,
              departure: {
                notifications: {},
              },
            },
          },
        });
        mutateHotel((h) => {
          if (!h) {
            return h;
          }

          h.bookingsSettings = {
            ...bookingsSettings,
            departure: {
              notifications: {},
            },
          };

          return { ...h };
        }, false);
        toast.update(toastId, 'Booking settings updated successfully');
        onSuccess?.();
      } catch (error) {
        toast.update(toastId, 'Unable to update booking settings');
      }
    },
    [mutateHotel]
  );

  const onSubmit = useCallback(
    async (formValues: FormValues, isLastStep = false) => {
      if (!hotel?.bookingsSettings) {
        const newBookingSettings = {
          ...bookingsSettings,
          ...formValues,
        } as BookingsSettings;

        setBookingsSettings(newBookingSettings);

        if (isLastStep) {
          await updateSettings(newBookingSettings, () => {
            history.push('/bookings');
          });
        }
      } else {
        const newBookingsSettings = {
          ...hotel.bookingsSettings,
          ...formValues,
        };
        setBookingsSettings(newBookingsSettings as BookingsSettings);
        await updateSettings(newBookingsSettings as BookingsSettings);
      }
    },
    [
      hotel?.bookingsSettings,
      bookingsSettings,
      setBookingsSettings,
      updateSettings,
      history,
    ]
  );

  useEffect(() => {
    setBookingsSettings(hotel?.bookingsSettings);
  }, [hotel, setBookingsSettings]);

  return (
    <>
      <Header
        title="Bookings"
        backgroundColor="#fafafa"
        onBack={() => history.push('/manage')}
        indicator={
          <ToggleDropdown
            enabled={!!hotel?.bookingsSettings?.enabled}
            dropdown={false}
          />
        }
      />
      <SWrapper>
        <ManageBookingsCheckInMenuBar />
        <SPagesWrapper>
          <Switch>
            <Route
              exact
              path="/manage/bookings"
              component={() => (
                <ManageBookingsCheckInGeneral onUpdate={onSubmit} />
              )}
            />
            <Route
              exact
              path="/manage/bookings/pre-arrival"
              component={() => (
                <ManageBookingsCheckInPreArrival onUpdate={onSubmit} />
              )}
            />
            <Route
              exact
              path="/manage/bookings/arrival"
              component={() => (
                <ManageBookingsCheckInArrival onUpdate={onSubmit} />
              )}
            />
            {/* <Route
              exact
              path="/manage/bookings/departure"
              component={() => (
                <ManageBookingsCheckInDeparture onUpdate={onSubmit} />
              )}
            /> */}
            <Route
              exact
              path="/manage/bookings/customization"
              component={() => (
                <ManageBookingsCheckInCustomization onUpdate={onSubmit} />
              )}
            />
          </Switch>
        </SPagesWrapper>
      </SWrapper>
    </>
  );
};
