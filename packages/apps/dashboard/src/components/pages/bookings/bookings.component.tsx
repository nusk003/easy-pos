import {
  Booking,
  BookingsSettingsInput,
  BookingStatus,
  QueryBookingAnalyticsArgs,
  SearchBookingsQueryVariables,
} from '@hm/sdk';
import { ReactComponent as BedBlueIcon } from '@src/assets/icons/bed-blue-icon.svg';
import { ReactComponent as BedIcon } from '@src/assets/icons/bed-icon.svg';
import { ReactComponent as DoorIcon } from '@src/assets/icons/door-icon.svg';
import { ReactComponent as KeyIcon } from '@src/assets/icons/key-icon.svg';
import { ReactComponent as VerifiedIcon } from '@src/assets/icons/verified-icon.svg';
import {
  Button,
  CircleIcon,
  Link,
  Row,
  Text,
  toast,
} from '@src/components/atoms';
import { Card, Table, ToggleDropdown } from '@src/components/molecules';
import { Inputs } from '@src/components/molecules/inputs';
import { BookingsOverviewCard } from '@src/components/organisms';
import {
  BookingsAddModal,
  BookingsModal,
  Form,
  Header,
} from '@src/components/templates';
import { theme } from '@src/components/theme';
import { useIsPMSActive } from '@src/util/integrations';
import { sdk } from '@src/xhr/graphql-request';
import { useBookingsAnalytics, useHotel } from '@src/xhr/query';
import { useSearchBookings } from '@src/xhr/query/search-bookings.query';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { FaFile } from 'react-icons/fa';
import { useHistory, useLocation } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';

dayjs.extend(utc);

enum BookingsDateFilter {
  Today = 'Today',
  TwoDays = 'Next 2 days',
  SevenDays = 'Next 7 days',
  All = 'All time',
}

enum BookingsTypeFilter {
  All = 'All',
  Arrivals = 'Arrivals',
  Departures = 'Departures',
}

const SWrapper = styled.div`
  padding: 32px;
  padding-bottom: 0;
  padding-right: 16px;

  ${theme.mediaQueries.tablet} {
    padding: 16px;
    padding-bottom: 0;
    padding-right: 0;
  }
`;

const SBookingsOverviewCardsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(auto, 360px));
  gap: 24px;
  justify-content: start;

  ${theme.mediaQueries.laptop} {
    grid-template-columns: repeat(2, minmax(auto, 360px));
  }

  ${theme.mediaQueries.tablet} {
    grid-template-columns: 1fr;
  }
`;

const STableProvider = styled(Table.Provider)`
  border: none;
`;

const SBodyCell = styled(Table.Cell).attrs({ noBorder: true })<SpaceProps>`
  width: max-content;
  ${space};
`;

const SBookingsWrapper = styled.div`
  height: calc(100vh - 380.5px - 16px);
  margin-top: 24px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  ${theme.mediaQueries.tablet} {
    height: calc(100vh - 450.5px - 16px);
  }
`;

const SMoonLoaderWrapper = styled.div`
  display: grid;
  justify-content: center;
`;

const SInputWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: max-content;
  grid-gap: 16px;
  justify-content: flex-start;
  align-items: center;
  margin: 24px 0;
`;

interface FormValues {
  date: BookingsDateFilter;
  type: BookingsTypeFilter;
}

export const Bookings: React.FC = () => {
  const history = useHistory();
  const { search } = useLocation();

  const {
    data: hotel,
    isValidating: isHotelValidating,
    mutate: mutateHotel,
  } = useHotel();

  const [bookingAnalyticsQuery, setBookingAnalyticsQuery] =
    useState<QueryBookingAnalyticsArgs>({
      startDate: dayjs().utc(true).startOf('day').toDate(),
      endDate: dayjs().utc(true).add(1, 'day').startOf('day').toDate(),
    });

  const isPMSActive = useIsPMSActive();

  const { data: bookingAnalytics } = useBookingsAnalytics(
    bookingAnalyticsQuery
  );

  const limit = 30;

  const [searchBookingsQuery, setSearchBookingsQuery] =
    useState<SearchBookingsQueryVariables>({
      limit,
      startCheckInDate: dayjs().utc(true).startOf('day').toDate(),
      endCheckInDate: dayjs().utc(true).startOf('day').add(1, 'day').toDate(),
    });

  const {
    data: bookingsStack,
    setSize,
    size,
    error,
    mutate: mutateSearchBookings,
  } = useSearchBookings(searchBookingsQuery);

  const formMethods = useForm<FormValues>({
    defaultValues: {
      date: BookingsDateFilter.Today,
      type: BookingsTypeFilter.Arrivals,
    },
  });

  const [dateRangeFilter, setDateRangeFilter] = useState<BookingsDateFilter>(
    BookingsDateFilter.Today
  );
  const [bookingTypeFilter, setBookingTypeFilter] =
    useState<BookingsTypeFilter>(BookingsTypeFilter.Arrivals);

  const [isAddBookingModalVisible, setIsAddBookingModalVisible] =
    useState(false);

  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | undefined>();

  const isBookingsEmpty = !bookingsStack || bookingsStack.length === 0;

  const isBookingsReachingEnd =
    isBookingsEmpty ||
    (bookingsStack && bookingsStack[size - 1]?.length < limit);

  const isLoadingInitialBookings = !bookingsStack && !error;

  const isBookingsLoadingMore =
    isLoadingInitialBookings ||
    (size > 0 &&
      bookingsStack &&
      typeof bookingsStack?.[size - 1] === 'undefined');

  const handleChangeFilters = useCallback(
    (
      bookingTypeFilter: BookingsTypeFilter,
      bookingDateFilter: BookingsDateFilter
    ) => {
      const dayOffset =
        bookingDateFilter === BookingsDateFilter.Today
          ? 1
          : bookingDateFilter === BookingsDateFilter.TwoDays
          ? 2
          : bookingDateFilter === BookingsDateFilter.SevenDays
          ? 7
          : 0;

      const start = dayjs().utc(true).startOf('day').toDate();
      const end =
        bookingDateFilter === BookingsDateFilter.Today
          ? dayjs().utc(true).startOf('day').add(1, 'day').toDate()
          : bookingDateFilter === BookingsDateFilter.TwoDays
          ? dayjs().utc(true).startOf('day').add(2, 'day').toDate()
          : dayjs().utc(true).startOf('day').add(7, 'day').toDate();

      const startDate = undefined;
      const endDate = undefined;
      const startCheckInDate =
        bookingTypeFilter === BookingsTypeFilter.Arrivals ? start : undefined;
      const endCheckInDate =
        bookingTypeFilter === BookingsTypeFilter.Arrivals ? end : undefined;
      const startCheckOutDate =
        bookingTypeFilter === BookingsTypeFilter.Departures ? start : undefined;
      const endCheckOutDate =
        bookingTypeFilter === BookingsTypeFilter.Departures ? end : undefined;

      setDateRangeFilter(bookingDateFilter);
      setBookingTypeFilter(bookingTypeFilter);

      setBookingAnalyticsQuery({
        startDate: dayjs().utc(true).startOf('day').toDate(),
        endDate: dayjs()
          .utc(true)
          .add(dayOffset, 'days')
          .startOf('day')
          .toDate(),
      });

      setSearchBookingsQuery((s) => ({
        ...s,
        status: undefined,
        query: undefined,
        startCheckInDate,
        endCheckInDate,
        startCheckOutDate,
        endCheckOutDate,
        startDate,
        endDate,
      }));
    },
    []
  );

  const handleChangeFormFilters = ({
    type: bookingsTypeFilter,
    date: dateRangeFilter,
  }: FormValues) => {
    if (dateRangeFilter === BookingsDateFilter.All) {
      formMethods.setValue('type', BookingsTypeFilter.All);
      handleChangeFilters(BookingsTypeFilter.All, dateRangeFilter);
      return;
    }

    if (bookingsTypeFilter === BookingsTypeFilter.All) {
      formMethods.setValue('type', BookingsTypeFilter.Arrivals);
      handleChangeFilters(BookingsTypeFilter.Arrivals, dateRangeFilter);
      return;
    }

    handleChangeFilters(bookingsTypeFilter, dateRangeFilter);
  };

  const handleSubmittedFilter = () => {
    setSearchBookingsQuery((s) => ({
      ...s,
      status:
        s.status === BookingStatus.Submitted
          ? undefined
          : BookingStatus.Submitted,
      startCheckInDate: undefined,
      endCheckInDate: undefined,
      startCheckOutDate: undefined,
      endCheckOutDate: undefined,
    }));
    setDateRangeFilter(BookingsDateFilter.All);
    setBookingTypeFilter(BookingsTypeFilter.All);
    formMethods.setValue('type', BookingsTypeFilter.All);
    formMethods.setValue('date', BookingsDateFilter.All);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;

    if (bottom) {
      if (isBookingsReachingEnd || isBookingsLoadingMore) {
        return;
      }
      setSize(size + 1);
    }
  };

  const handleSearchQueryChange = _.debounce((searchQuery: string) => {
    if (!searchQuery) {
      handleChangeFilters(bookingTypeFilter, dateRangeFilter);
      return;
    }

    setSearchBookingsQuery((s) => ({
      ...s,
      startDate: undefined,
      endDate: undefined,
      startCheckInDate: undefined,
      endCheckInDate: undefined,
      startCheckOutDate: undefined,
      endCheckOutDate: undefined,
      status: undefined,
      query: searchQuery,
    }));
  }, 300);

  const handleOpenBookingsModal = (booking: Booking) => {
    setIsBookingModalVisible(true);
    setCurrentBooking(booking);
  };

  const handleCloseBookingsModal = () => {
    setIsBookingModalVisible(false);
    setTimeout(() => {
      setCurrentBooking(undefined);
    }, 300);
  };

  const handleBookingUpdated = () => {
    mutateSearchBookings();
  };

  const handleToggleEnabled = async (value: boolean) => {
    try {
      await sdk.updateHotel({
        data: {
          bookingsSettings: {
            ...hotel?.bookingsSettings,
            enabled: value,
          } as BookingsSettingsInput,
        },
      });
      toast.info(`Successfully ${value ? 'enabled' : 'disabled'} bookings`);
    } catch {
      toast.info(`Unable to ${value ? 'enable' : 'disable'} bookings`);
    }

    await mutateHotel();
  };

  const handleNotificationOpen = useCallback(
    async (id: string) => {
      try {
        const { booking } = await sdk.booking({ where: { id } });
        history.push('/bookings', { booking });
      } catch {
        history.push('/bookings');
      }
    },
    [history]
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    if (location.search) {
      const id = searchParams.get('id');
      if (id) {
        handleNotificationOpen(id as string);
      }
    }
  }, [handleNotificationOpen, search]);

  useEffect(() => {
    if (!isHotelValidating && !hotel?.bookingsSettings) {
      history.push('/manage/bookings');
    }
  }, [history, hotel, hotel?.bookingsSettings, isHotelValidating]);

  if (!hotel || (hotel && !hotel.bookingsSettings)) {
    return null;
  }

  return (
    <>
      <BookingsAddModal
        visible={isAddBookingModalVisible}
        onClose={() => setIsAddBookingModalVisible(false)}
      />

      <BookingsModal
        visible={isBookingModalVisible}
        booking={currentBooking}
        onClose={handleCloseBookingsModal}
        onUpdateBooking={handleBookingUpdated}
      />

      <Header
        title="Bookings"
        dropdownButtons={[
          {
            title: 'Manage',
            onClick: () => history.push('/manage/bookings'),
          },
        ]}
        primaryButton={
          !isPMSActive && hotel?.bookingsSettings?.enabled ? (
            <Button
              onClick={() => setIsAddBookingModalVisible(true)}
              leftIcon={<BedIcon fill="white" />}
              buttonStyle="primary"
            >
              Add a booking
            </Button>
          ) : null
        }
        indicator={
          !hotel?.bookingsSettings?.enabled ? (
            <ToggleDropdown
              enabled={!!hotel?.bookingsSettings?.enabled}
              onToggle={handleToggleEnabled}
            />
          ) : undefined
        }
      />

      <SWrapper>
        <SBookingsOverviewCardsWrapper>
          <BookingsOverviewCard
            icon={KeyIcon}
            iconColor={theme.colors.blue}
            iconBackgroundColor={theme.colors.lightBlue}
            count={bookingAnalytics?.noArrivals || 0}
            countSuffix={`arrivals ${
              dateRangeFilter === BookingsDateFilter.Today
                ? 'today'
                : `in the next ${
                    dateRangeFilter === BookingsDateFilter.TwoDays ? '2' : '7'
                  } days`
            } `}
          />

          <BookingsOverviewCard
            icon={DoorIcon}
            iconColor={theme.colors.orange}
            iconBackgroundColor={theme.colors.lightOrange}
            count={bookingAnalytics?.noDepartures || 0}
            countSuffix={`departures ${
              dateRangeFilter === BookingsDateFilter.Today
                ? 'today'
                : `in the next ${
                    dateRangeFilter === BookingsDateFilter.TwoDays ? '2' : '7'
                  } days`
            } `}
          />
        </SBookingsOverviewCardsWrapper>

        <SInputWrapper>
          <Inputs.BasicText
            name="searchBookings"
            placeholder="Search..."
            search
            onChange={(e) => handleSearchQueryChange(e.target.value)}
            autoComplete="off"
          />
          <FormContext {...formMethods}>
            <Form.Provider
              gridAutoFlow="column"
              justifyContent="start"
              gridGap="8px"
              onChange={formMethods.handleSubmit(handleChangeFormFilters)}
            >
              <Inputs.Select
                name="date"
                items={[
                  BookingsDateFilter.Today,
                  BookingsDateFilter.TwoDays,
                  BookingsDateFilter.SevenDays,
                  BookingsDateFilter.All,
                ]}
              />
              <Inputs.Select
                name="type"
                disabled={dateRangeFilter === BookingsDateFilter.All}
                items={
                  [
                    dateRangeFilter === BookingsDateFilter.All
                      ? BookingsTypeFilter.All
                      : undefined,
                    BookingsTypeFilter.Arrivals,
                    BookingsTypeFilter.Departures,
                  ].filter(Boolean) as BookingsTypeFilter[]
                }
              />
            </Form.Provider>
          </FormContext>
        </SInputWrapper>

        <BookingsOverviewCard
          icon={KeyIcon}
          iconColor={theme.colors.blue}
          iconBackgroundColor={theme.colors.lightBlue}
          description={
            <Link
              onClick={handleSubmittedFilter}
              fontWeight="semibold"
              disableOnClick={false}
            >
              {searchBookingsQuery.status === BookingStatus.Submitted
                ? 'View all'
                : 'Review all'}
            </Link>
          }
          count={bookingAnalytics?.noSubmittedBookings || 0}
          countSuffix="ready to review"
        />

        {bookingsStack && bookingsStack.flat().length > 0 ? (
          <SBookingsWrapper onScroll={handleScroll}>
            <STableProvider>
              <Table.Body>
                {bookingsStack?.flat()?.map((booking) => (
                  <Table.Row
                    key={booking.id}
                    onClick={() => handleOpenBookingsModal(booking)}
                  >
                    <SBodyCell p="0px" m="0px">
                      <CircleIcon
                        icon={() => <KeyIcon />}
                        color={theme.colors.blue}
                        background={theme.colors.lightBlue}
                        my="4px"
                      />
                    </SBodyCell>
                    <SBodyCell>
                      <div>
                        <Row>
                          <Text.BodyBold mr="4px">
                            {booking.guest?.firstName} {booking.guest?.lastName}
                          </Text.BodyBold>
                          {booking.guest && booking.dateSubmitted ? (
                            <VerifiedIcon />
                          ) : null}
                        </Row>
                        {booking.guest && booking.dateSubmitted ? (
                          <Text.SecondarySubtitle mt="4px">
                            Checked-in via app
                          </Text.SecondarySubtitle>
                        ) : null}
                        {booking.status === BookingStatus.Canceled ? (
                          <Text.SecondarySubtitle
                            color={theme.textColors.orange}
                            fontWeight="medium"
                            mt="4px"
                          >
                            Canceled
                          </Text.SecondarySubtitle>
                        ) : null}
                      </div>
                    </SBodyCell>
                    <SBodyCell>
                      <Text.BodyBold
                        color={theme.textColors.lightGray}
                        fontWeight="semibold"
                      >
                        {booking.bookingReference
                          ? `#${booking.bookingReference.toUpperCase()}`
                          : ''}
                      </Text.BodyBold>
                    </SBodyCell>
                    <SBodyCell>
                      <Text.BodyBold color={theme.textColors.lightGray}>
                        {dayjs(booking.checkInDate).format('DD MMM YYYY')} –{' '}
                        {dayjs(booking.checkOutDate).format('DD MMM YYYY')}
                      </Text.BodyBold>
                      {booking.estimatedTimeOfArrival ? (
                        <Text.BodyBold mt="4px" color={theme.textColors.blue}>
                          {booking.estimatedTimeOfArrival}
                        </Text.BodyBold>
                      ) : null}
                    </SBodyCell>
                    <SBodyCell>
                      <Text.Primary color={theme.textColors.lightGray}>
                        {booking.roomNumber
                          ? `Room ${booking.roomNumber}`
                          : 'Unassigned'}
                      </Text.Primary>
                    </SBodyCell>
                    <SBodyCell>
                      <Button
                        leftIcon={
                          booking.status === BookingStatus.Submitted ? (
                            <FaFile />
                          ) : null
                        }
                        buttonStyle="secondary"
                      >
                        {booking.status === BookingStatus.Created
                          ? 'Created'
                          : booking.status === BookingStatus.Submitted
                          ? 'Review'
                          : booking.status === BookingStatus.Reviewed
                          ? 'Arrived?'
                          : booking.status === BookingStatus.CheckedIn
                          ? 'Arrived'
                          : 'Departed'}
                      </Button>
                    </SBodyCell>
                  </Table.Row>
                ))}
                {isBookingsLoadingMore ? (
                  <Table.Row>
                    <SBodyCell pt="0" pb="8px" colSpan={6}>
                      <SMoonLoaderWrapper>
                        <MoonLoader size={16} color={theme.colors.blue} />
                      </SMoonLoaderWrapper>
                    </SBodyCell>
                  </Table.Row>
                ) : null}
              </Table.Body>
            </STableProvider>
          </SBookingsWrapper>
        ) : (
          <Card mt="24px" maxWidth="800px" cardStyle="light-blue">
            <Row>
              <CircleIcon
                color={theme.colors.lightBlue}
                background={theme.colors.lightBlue}
                icon={() => <BedBlueIcon />}
              />
              <div>
                <Text.SecondarySubtitle>
                  You currently have no bookings
                </Text.SecondarySubtitle>
                {!isPMSActive && hotel?.bookingsSettings?.enabled ? (
                  <Link
                    onClick={() => setIsAddBookingModalVisible(true)}
                    mt="4px"
                    disableOnClick={false}
                    fontWeight="semibold"
                  >
                    Add a booking
                  </Link>
                ) : null}
              </div>
            </Row>
          </Card>
        )}
      </SWrapper>
    </>
  );
};
