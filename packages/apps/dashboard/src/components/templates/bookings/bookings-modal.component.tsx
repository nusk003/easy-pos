import { Booking, BookingStatus } from '@hm/sdk';
import { getNights, getBookingTime } from '@hm/booking';
import { ReactComponent as SimpleVerifiedIcon } from '@src/assets/icons/simple-verified-icon.svg';
import { Link, Row, Tag, Text, toast } from '@src/components/atoms';
import { Card, Modal, Verify } from '@src/components/molecules';
import { theme } from '@src/components/theme';
import { useIsPMSActive } from '@src/util/integrations';
import { sdk } from '@src/xhr/graphql-request';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useMemo, useState } from 'react';
import { FaArrowRight, FaMoon } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';
import {
  BookingsModalForm,
  BookingsModalFormValues,
} from './bookings-modal-form.component';

dayjs.extend(utc);

const SModal = styled(Modal)<SpaceProps>`
  min-width: 360px;
  max-width: 540px;
  width: 60vw;

  ${theme.mediaQueries.tablet} {
    min-width: unset;
    max-width: unset;
    width: 80vw;
  }

  ${space}
`;

const SHeader = styled.div`
  position: sticky;
  z-index: 1;
  background: #fff;
  top: 0;
  padding-top: 24px;
  padding-bottom: 16px;
`;

const SDatesWrapper = styled.div`
  display: grid;
  margin-top: 8px;
  align-items: center;
  grid-auto-flow: column;
  justify-content: space-between;

  ${theme.mediaQueries.tablet} {
    gap: 4px;
    grid-auto-flow: row;
  }
`;

interface Props {
  visible: boolean;
  booking: Booking | undefined;
  onClose: () => void;
  onUpdateBooking?: () => void;
}

export const BookingsModal: React.FC<Props> = React.memo(
  ({ booking: defaultValues, onClose, visible, onUpdateBooking }) => {
    const history = useHistory();

    const isPMSActive = useIsPMSActive();

    const [submitLoading, setSubmitLoading] = useState(false);
    const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false);

    const [booking, setBooking] = useState(defaultValues);

    const handleSubmit = async (
      {
        estimatedTimeOfArrival,
        party: party,
        purposeOfStay,
        closeModal,
      }: BookingsModalFormValues,
      updateStatus = true
    ) => {
      if (!booking) {
        return;
      }

      const action =
        booking.status === BookingStatus.Created
          ? BookingStatus.Submitted
          : booking.status === BookingStatus.Submitted
          ? BookingStatus.Reviewed
          : booking.status === BookingStatus.Reviewed
          ? BookingStatus.CheckedIn
          : (undefined as never);

      const newBooking: Partial<Booking> = {
        ...booking,
        ...(updateStatus && { status: action }),
        estimatedTimeOfArrival,
        purposeOfStay,
        party: booking?.party?.map((guest, index) => ({
          ...guest,
          ...party?.[index],
          dateOfBirth: party?.[index]?.dateOfBirth
            ? dayjs(party[index].dateOfBirth)
                .utc(true)
                .startOf('day')
                .toISOString()
            : guest.dateOfBirth,
        })),
      };

      setBooking({ ...(newBooking as Booking) });

      delete newBooking.id;
      delete newBooking.guest;

      delete newBooking.dateCreated;
      delete newBooking.dateUpdated;
      delete newBooking.dateCheckedIn;
      delete newBooking.dateCheckedOut;
      delete newBooking.dateCanceled;
      delete newBooking.dateReviewed;
      delete newBooking.dateSubmitted;

      delete newBooking.deleted;

      setSubmitLoading(true);

      const toastId = toast.loader('Updating booking');

      try {
        setIsVerifyModalVisible(false);

        await sdk.updateBooking({
          where: { id: booking.id },
          data: newBooking as Booking,
        });
        toast.update(toastId, 'Successfully updated booking');

        if (closeModal !== false) {
          onClose();
        }

        onUpdateBooking?.();
      } catch (error) {
        const errorMessage = (error as any)?.response?.errors?.[0]
          .message as string;
        let message = 'Unable to update booking';
        if (errorMessage) {
          const errorMessageParts = errorMessage?.split(':');
          if (errorMessageParts?.[0] === 'Mews') {
            message = errorMessageParts[1];
          }

          toast.update(toastId, message);
        }
      }
      setSubmitLoading(false);
    };

    const noNights = useMemo(
      () => (booking ? getNights(booking) : 0),
      [booking]
    );

    useEffect(() => {
      setBooking({ ...(defaultValues as Booking) });
    }, [defaultValues]);

    return (
      <>
        <SModal
          visible={visible}
          onClose={onClose}
          px={isVerifyModalVisible ? 0 : '24px'}
        >
          <Verify
            visible={isVerifyModalVisible}
            onClose={() => setIsVerifyModalVisible(false)}
            title="Check in"
            message="There may be no room assigned to this reservation. Checking in a guest will auto-assign an available room."
            onVerify={handleSubmit as unknown as () => void}
            type="primary"
            buttonText="Check in"
          >
            <React.Fragment key={booking?.id}>
              <SHeader>
                {booking?.dateSubmitted ? (
                  <Row justifyContent="space-between">
                    <Text.Notes>Checked in via app</Text.Notes>
                    <Text.Notes>
                      {booking ? getBookingTime(booking) : ''}
                    </Text.Notes>
                  </Row>
                ) : null}
                <Row
                  mt="8px"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <div>
                    <Text.Heading>
                      {booking?.guest?.firstName} {booking?.guest?.lastName}
                    </Text.Heading>
                    <Link
                      mt="4px"
                      onClick={() =>
                        history.push(`guests/${booking?.guest?.id}`)
                      }
                      fontWeight="semibold"
                      rightIcon={<FaArrowRight />}
                    >
                      View full profile
                    </Link>
                  </div>
                  {booking?.status === BookingStatus.Created ? (
                    <Tag tagStyle="blue-border">Created</Tag>
                  ) : booking?.status === BookingStatus.Submitted ||
                    booking?.status === BookingStatus.Reviewed ? (
                    <Tag tagStyle="blue">Arrived?</Tag>
                  ) : booking?.status === BookingStatus.CheckedIn ? (
                    <Tag tagStyle="blue">Arrived</Tag>
                  ) : null}
                </Row>

                <Card mt="32px" cardStyle="white-shadow">
                  {booking?.bookingReference ? (
                    <Text.Body color={theme.textColors.lightGray}>
                      Booking #{booking?.bookingReference?.toUpperCase()}
                      {booking?.status === BookingStatus.Canceled ? (
                        <>
                          {' '}
                          •
                          <Text.Body
                            color={theme.textColors.orange}
                            fontWeight="medium"
                            as="span"
                          >
                            {' '}
                            Canceled
                          </Text.Body>
                        </>
                      ) : null}
                    </Text.Body>
                  ) : null}

                  <SDatesWrapper>
                    <Row alignItems="center">
                      <Text.BodyBold mr="8px">
                        {dayjs(booking?.checkInDate).format('ddd D MMM')} —{' '}
                        {dayjs(booking?.checkOutDate).format('ddd D MMM')}
                      </Text.BodyBold>
                      <FaMoon />
                      <Text.BodyBold ml="8px">
                        {noNights} night
                        {noNights > 1 ? 's' : ''}
                      </Text.BodyBold>
                    </Row>
                    {booking?.dateSubmitted ? (
                      <Row alignItems="center">
                        <Text.SecondarySubtitle mr="4px">
                          Checked in via app
                        </Text.SecondarySubtitle>
                        <SimpleVerifiedIcon />
                      </Row>
                    ) : null}
                  </SDatesWrapper>
                  {booking?.party ? (
                    <Row mt="4px">
                      <Text.BodyBold
                        mr="4px"
                        color={theme.textColors.lightGray}
                      >
                        •
                      </Text.BodyBold>
                      <Text.BodyBold color={theme.textColors.blue}>
                        {booking?.party.length} guest
                        {booking?.party.length > 1 ? 's' : ''}
                      </Text.BodyBold>
                    </Row>
                  ) : null}
                </Card>
              </SHeader>

              {booking?.party ? (
                <BookingsModalForm
                  loading={submitLoading}
                  onCancel={onClose}
                  onSubmit={
                    isPMSActive &&
                    booking.status === BookingStatus.Reviewed &&
                    booking.roomNumber === null
                      ? () => setIsVerifyModalVisible(true)
                      : handleSubmit
                  }
                  booking={booking}
                />
              ) : null}
            </React.Fragment>
          </Verify>
        </SModal>
      </>
    );
  }
);
