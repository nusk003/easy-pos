import { AgeGroup, Booking } from '@src/modules/booking/booking.entity';
import { Guest } from '@src/modules/guest/guest.entity';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { v4 as uuid } from 'uuid';
import {
  MewsCustomer,
  MewsReservation,
  MewsReservationState,
  MewsGetAllReservationsResponse,
} from '@src/modules/integrations/types';
import { CustomFieldType } from '@src/modules/hotel/entities';

dayjs.extend(utc);

export const mapMewsCustomerToParty = (customer: MewsCustomer) => {
  const ageGroup = customer?.BirthDate
    ? dayjs().diff(dayjs(customer.BirthDate), 'years') >= 18
      ? AgeGroup.Adult
      : AgeGroup.Child
    : AgeGroup.Adult;
  return {
    id: uuid(),
    ageGroup,
    pmsId: customer.Id,
    ...(customer?.FirstName && { firstName: customer.FirstName }),
    ...(customer?.Address && { address: customer.Address.Line1 }),
    ...(customer?.LastName && { lastName: customer.LastName }),
    ...(customer?.Email && { email: customer.Email }),
    ...(customer?.Address?.CountryCode && {
      countryOfResidence: customer.Address.CountryCode,
    }),
    ...(customer?.NationalityCode && {
      nationality: customer.NationalityCode,
    }),
    ...(customer?.BirthDate && {
      dateOfBirth: new Date(customer.BirthDate),
    }),
    ...(customer?.Passport && {
      passportNumber: customer.Passport.Number,
    }),
    ...(customer?.Phone && {
      mobile: customer.Phone,
      mobileCountryCode: customer?.Address?.CountryCode,
    }),
  };
};

export const mapMewsReservationToBooking = ({
  Reservation,
  Resources,
  Customers,
  ResourceCategories,
  ResourceCategoryAssignments,
}: {
  Reservation: MewsReservation;
} & Omit<MewsGetAllReservationsResponse, 'Reservations'>) => {
  const {
    Id,
    AdultCount,
    ChildCount,
    StartUtc,
    EndUtc,
    State,
    CancelledUtc,
    CompanionIds,
    AssignedResourceId,
    Purpose,
  } = Reservation;
  const resource = Resources?.find(({ Id: id }) => id === AssignedResourceId);
  const resourceCategoryAssignment = ResourceCategoryAssignments.find(
    ({ ResourceId }) => ResourceId === resource?.Id
  );
  const resourceCategory = ResourceCategories.find(
    ({ Id }) => Id === resourceCategoryAssignment?.CategoryId
  );

  return {
    pmsId: Id,
    numberOfAdults: AdultCount,
    numberOfChildren: ChildCount,
    checkInDate: dayjs(StartUtc).utc().startOf('day').toDate(),
    checkOutDate: dayjs(EndUtc).utc().startOf('day').toDate(),
    party: CompanionIds.map((companionId) => {
      const companion = Customers.find(({ Id }) => Id === companionId);
      return mapMewsCustomerToParty(companion!);
    }),
    ...(resource && { roomNumber: resource.Name }),
    ...(resourceCategory && { roomType: resourceCategory.Names['en-US'] }),
    ...(State === MewsReservationState.Canceled && {
      dateCanceled: dayjs(CancelledUtc).utc().startOf('day').toDate(),
    }),
    ...(State === MewsReservationState.Started && {
      dateCheckedIn: dayjs(StartUtc).utc().startOf('day').toDate(),
    }),
    ...(Purpose && { purposeOfStay: Purpose }),
  };
};

export const mapMewsCustomerToGuest = (
  customer: MewsCustomer
): Partial<Guest> => {
  return {
    deviceId: uuid(),
    firstName: customer.FirstName,
    lastName: customer.LastName,
    email: customer.Email,
    mobileCountryCode: customer.Address?.CountryCode,
    countryOfResidence: customer.Address?.CountryCode,
    mobile: customer.Phone,
    ...(customer.BirthDate && {
      dateOfBirth: dayjs(customer.BirthDate).utc(true).startOf('day').toDate(),
    }),
    nationality: customer.NationalityCode,
    pmsId: customer.Id,
  };
};

const getNotes = (
  { checkInDate, checkOutDate, party, bookingDetails }: Booking,
  mewsCustomer: MewsCustomer | undefined
) => {
  if (!mewsCustomer) {
    return undefined;
  }

  const { Notes } = mewsCustomer;

  let oldNotes = Notes;

  if (!oldNotes || oldNotes === null) {
    oldNotes = '';
  }

  const partyMember = party?.find(({ pmsId }) => pmsId === mewsCustomer.Id);

  if (!partyMember) {
    return undefined;
  }

  const strArr = oldNotes.split('-----');

  let newNotes = '';

  const dateRangeStr = `${dayjs(checkInDate).format('YYYY-MM-DD')} - ${dayjs(
    checkOutDate
  ).format('YYYY-MM-DD')}`;

  let updated = false;
  strArr.forEach((strPart) => {
    let updatedStr = strPart;
    if (strPart.match(dateRangeStr)) {
      updated = true;
      updatedStr = `${dateRangeStr}\n`;
      if (partyMember.company)
        updatedStr += `Company: ${partyMember.company}\n`;
      if (partyMember.job) updatedStr += `Job: ${partyMember.job}\n`;
      bookingDetails?.toggleQuestion.map(({ title, type, result, toggle }) => {
        updatedStr += `${title}: ${
          type === CustomFieldType.String ? result : toggle ? 'Yes' : 'No'
        }\n`;
      });
    }
    if (strPart.replace(/\s/g, '') !== '') {
      newNotes += updatedStr + '-----\n';
    }
  });

  if (!updated) {
    newNotes += `${dateRangeStr}\n`;
    if (partyMember.company) newNotes += `Company: ${partyMember.company}\n`;
    if (partyMember.job) newNotes += `Job: ${partyMember.job}\n`;
    bookingDetails?.toggleQuestion.map(({ title, type, result, toggle }) => {
      newNotes += `${title}: ${
        type === CustomFieldType.String ? result : toggle ? 'Yes' : 'No'
      }\n`;
    });

    newNotes += '-----\n';
  }

  return newNotes;
};

export const mapPartyToMewsCustomer = (
  booking: Booking,
  mewsCustomers: MewsCustomer[]
): Partial<MewsCustomer>[] => {
  return (booking.party || []).map(
    ({
      firstName,
      lastName,
      nationality,
      dateOfBirth,
      address,
      countryOfResidence,
      passportNumber,
      email,
      mobile,
    }) => {
      const mewsCustomer = mewsCustomers.find(({ Email }) => Email === email);

      return {
        Id: mewsCustomer?.Id,
        FirstName: firstName,
        LastName: lastName,
        ...(passportNumber && {
          Passport: { Number: passportNumber },
        }),

        Email: email,
        Notes: getNotes(booking, mewsCustomer),
        Phone: mobile,
        NationalityCode: nationality,
        BirthDate: dateOfBirth?.toISOString(),
        Address: {
          Line1: address,
          CountryCode: countryOfResidence,
        },
      };
    }
  );
};
