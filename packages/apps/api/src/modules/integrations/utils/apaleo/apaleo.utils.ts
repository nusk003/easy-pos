import {
  AgeGroup,
  Booking,
  BookingParty,
} from '@src/modules/booking/booking.entity';
import { Guest } from '@src/modules/guest/guest.entity';
import {
  GuestModel,
  KnownBookingReservationModelStatus,
  KnownGuestModelIdentificationType,
  ReservationItemModel,
} from '@src/modules/integrations/types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { v4 as uuid } from 'uuid';

dayjs.extend(utc);

export const mapApaleoGuestsToParty: (
  reservation: ReservationItemModel
) => BookingParty[] = ({ primaryGuest, additionalGuests }) => {
  const allGuests = [primaryGuest].concat(additionalGuests || []);

  return allGuests.map((apaleoGuest) => {
    return {
      id: uuid(),
      ageGroup: !apaleoGuest?.birthDate
        ? AgeGroup.Adult
        : dayjs().diff(apaleoGuest?.birthDate, 'years') >= 18
        ? AgeGroup.Adult
        : AgeGroup.Child,
      firstName: apaleoGuest?.firstName || '',
      lastName: apaleoGuest?.lastName || '',
      passportNumber:
        apaleoGuest?.identificationType ===
        KnownGuestModelIdentificationType.PassportNumber
          ? apaleoGuest.identificationNumber
          : undefined,
      email: apaleoGuest?.email,
      countryOfResidence: apaleoGuest?.address?.countryCode,
      address: apaleoGuest?.address
        ? [
            apaleoGuest.address?.addressLine1,
            apaleoGuest.address?.addressLine2,
            apaleoGuest.address?.city,
            apaleoGuest.address?.postalCode,
          ]
            .filter(Boolean)
            .join(', ')
        : undefined,
      dateOfBirth: apaleoGuest?.birthDate
        ? new Date(apaleoGuest?.birthDate)
        : undefined,
      mobile: apaleoGuest?.address?.countryCode ? apaleoGuest.phone : undefined,
      mobileCountryCode: apaleoGuest?.address?.countryCode,
      company: apaleoGuest?.company?.name,
      nationality: apaleoGuest?.nationalityCountryCode,
    };
  });
};

export const mapApaleoGuestToGuest: (
  apaleoGuest: GuestModel
) => Partial<Guest> = (apaleoGuest) => {
  return {
    firstName: apaleoGuest?.firstName,
    lastName: apaleoGuest?.lastName,
    email: apaleoGuest?.email,
    mobile: apaleoGuest.address?.countryCode ? apaleoGuest.phone : undefined,
    mobileCountryCode: apaleoGuest.address?.countryCode,
    company: apaleoGuest.company?.name,
    nationality: apaleoGuest.nationalityCountryCode,
    passportNumber:
      apaleoGuest.identificationType ===
      KnownGuestModelIdentificationType.PassportNumber
        ? apaleoGuest.identificationNumber
        : undefined,
    address: apaleoGuest.address
      ? [
          apaleoGuest.address?.addressLine1,
          apaleoGuest.address?.addressLine2,
          apaleoGuest.address?.city,
          apaleoGuest.address?.postalCode,
        ]
          .filter(Boolean)
          .join(', ')
      : undefined,
    countryOfResidence: apaleoGuest.address?.countryCode,
    dateOfBirth: apaleoGuest.birthDate,
  };
};

export const mapApaleoReservationToBooking: (
  reservation: ReservationItemModel
) => Partial<Booking> = (reservation) => {
  const {
    arrival,
    departure,
    unit,
    unitGroup,
    adults,
    childrenAges,
    id,
    status,
    checkInTime,
    cancellationTime,
    checkOutTime,
  } = reservation;

  return {
    checkInDate: dayjs(arrival).utc(true).startOf('day').toDate(),
    checkOutDate: dayjs(departure).utc(true).startOf('day').toDate(),
    numberOfAdults: adults,
    numberOfChildren: childrenAges?.length || 0,
    roomType: unitGroup.name + '-' + unitGroup.type,
    ...(status === KnownBookingReservationModelStatus.Canceled && {
      dateCanceled: cancellationTime,
    }),
    ...(status === KnownBookingReservationModelStatus.InHouse && {
      dateCheckedIn: checkInTime,
    }),
    ...(status === KnownBookingReservationModelStatus.CheckedOut && {
      dateCheckedOut: checkOutTime,
    }),
    ...(unit?.name && { roomNumber: unit?.name }),
    pmsId: id,
    bookingReference: id,
    party: mapApaleoGuestsToParty(reservation),
  };
};

export const mapBookingToApaleoReservation: (
  booking: Booking
) => Partial<ReservationItemModel> = (booking) => {
  const party = [...booking.party!];
  const allGuests: GuestModel[] = party.map((partyMember) => {
    const {
      firstName,
      lastName,
      countryOfResidence,
      nationality,
      dateOfBirth,
      email,
      passportNumber,
      mobile,
      company,
    } = partyMember;

    return {
      firstName,
      lastName: lastName!,
      address: {
        countryCode: countryOfResidence,
      },
      nationalityCountryCode: nationality,
      ...(dateOfBirth && {
        birthDate: dayjs(dateOfBirth).format('YYYY-MM-DD') as unknown as Date,
      }),
      email,
      ...(passportNumber && {
        identificationType: KnownGuestModelIdentificationType.PassportNumber,
        identificationNumber: passportNumber,
      }),
      ...(mobile && {
        phone: mobile,
      }),
      ...(company && { company: { name: company } }),
      ...(booking.estimatedTimeOfArrival &&
        dayjs(booking.checkInDate)
          .add(Number(booking.estimatedTimeOfArrival?.split(':')[0]), 'h')
          .add(Number(booking.estimatedTimeOfArrival?.split(':')[1]), 'm')),
    };
  });

  const primaryGuest = allGuests[0];
  const additionalGuests = allGuests.slice(1, allGuests.length);

  return { primaryGuest, additionalGuests };
};
