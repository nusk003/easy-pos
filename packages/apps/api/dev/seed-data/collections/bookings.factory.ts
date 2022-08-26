import { faker, rand } from '@dev/seed-data/util';
import {
  AgeGroup,
  Booking,
  BookingDetails,
  BookingParty,
} from '@src/modules/booking/booking.entity';
import { CustomFieldType } from '@src/modules/hotel/entities';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ObjectId } from 'mongodb';
import { v4 as uuid } from 'uuid';
import { mainGroup } from './groups.factory';
import { guests } from './guests.factory';
import { mainHotel } from './hotels.factory';

dayjs.extend(utc);

export const bookingIds = [...Array(100).keys()].map(() => new ObjectId());
export const bookings = bookingIds.map((id) => {
  const guest = guests[rand.int(guests.length)];
  const booking = new Booking();

  booking._id = id;
  booking.hotel = mainHotel;
  booking.group = mainGroup;
  booking.guest = guest;
  booking.checkInDate = dayjs()
    .utc()
    .add(rand.int(-30, 30), 'days')
    .startOf('day')
    .toDate();
  booking.checkOutDate = dayjs(booking.checkInDate)
    .utc()
    .add(rand.normal(7, 2)(), 'days')
    .startOf('day')
    .toDate();
  booking.bookingReference = rand.int(0, 100000000000).toString();
  booking.roomNumber =
    rand.int(1, 2) === 1 ? String(rand.int(1, 200)) : undefined;

  booking.dateCreated = dayjs(booking.checkInDate)
    .subtract(rand.int(1, 7), 'day')
    .toDate();

  const isCheckedIn = dayjs(booking.checkInDate).isBefore(Date.now());
  const isCheckedOut = dayjs(booking.checkOutDate).isBefore(Date.now());

  if (isCheckedIn || isCheckedOut || rand.int(1, 2) === 1) {
    booking.dateSubmitted = new Date(
      booking.dateCreated.valueOf() +
        (booking.checkInDate.valueOf() - booking.dateCreated.valueOf()) *
          rand.float(0, 1)
    );
  }

  if (
    isCheckedIn ||
    isCheckedOut ||
    (booking.dateSubmitted && rand.int(1, 2) === 1)
  ) {
    booking.dateReviewed = new Date(
      booking.dateSubmitted!.valueOf() +
        (booking.checkInDate.valueOf() - booking.dateSubmitted!.valueOf()) *
          rand.float(0, 1)
    );
  }

  if (isCheckedOut || (booking.dateReviewed && rand.int(1, 2) === 1)) {
    booking.dateCheckedIn = dayjs(booking.checkInDate)
      .add(15, 'hours')
      .add(rand.float(0, 60), 'minutes')
      .toDate();
  }

  if (booking.dateSubmitted) {
    const numberOfGuests = rand.int(1, 3);

    let numberOfAdults = 1;
    let numberOfChildren = 0;

    const mainCountryCode =
      guest.mobileCountryCode || faker.address.countryCode();

    const mainParty: BookingParty = {
      id: uuid(),
      firstName: guest.firstName!,
      lastName: guest.lastName!,
      ageGroup: AgeGroup.Adult,
      email: guest.email,
      mobile: guest.mobile || faker.phone.phoneNumber('7#########'),
      mobileCountryCode: mainCountryCode,
      countryOfResidence: mainCountryCode,
      address: faker.address.streetAddress(true) + ', ' + faker.address.city(),
      nationality: mainCountryCode,
      passportNumber: faker.datatype.number(2222222222).toString(),
      dateOfBirth: dayjs(
        faker.date.past(20, dayjs().subtract(20, 'years').toDate())
      )
        .utc()
        .startOf('day')
        .toDate(),
      dietaryRequirements: rand.int(1, 4) === 1 ? 'Vegan' : undefined,
      specialOccasions: rand.int(1, 4) === 1 ? 'Birthday' : undefined,
      job: faker.name.jobTitle(),
      company: faker.company.companyName(),
    };

    booking.party = [
      mainParty,
      ...[Array(numberOfGuests - 1).keys()].map(() => {
        const firstName = faker.name.firstName();
        const randomNumber = rand.int(1, 2);
        if (randomNumber === 2) {
          numberOfAdults += 1;
        } else {
          numberOfChildren += 1;
        }
        const ageGroup: AgeGroup =
          randomNumber === 2 ? AgeGroup.Adult : AgeGroup.Child;

        const partyCountryCode = faker.address.countryCode();

        return {
          id: uuid(),
          firstName,
          lastName: faker.name.lastName(),
          ageGroup,
          email: faker.internet.email(firstName).toLowerCase(),
          mobile: faker.phone.phoneNumber('7#########'),
          mobileCountryCode: partyCountryCode,
          countryOfResidence: partyCountryCode,
          address:
            faker.address.streetAddress(true) + ', ' + faker.address.city(),
          nationality: partyCountryCode,
          passportNumber: faker.datatype.number(2222222222).toString(),
          dateOfBirth:
            ageGroup === AgeGroup.Child
              ? dayjs(faker.date.past(18)).utc().startOf('day').toDate()
              : dayjs(
                  faker.date.past(40, dayjs().subtract(20, 'years').toDate())
                )
                  .utc()
                  .startOf('day')
                  .toDate(),
          job: faker.name.jobTitle(),
          company: faker.company.companyName(),
        };
      }),
    ];

    booking.numberOfAdults = numberOfAdults;
    booking.numberOfChildren = numberOfChildren;
    const toggleQuestion =
      booking.hotel.bookingsSettings?.preArrival.fields.customFields?.map(
        ({ title, type }) => {
          return {
            title,
            type,
            ...(type === CustomFieldType.Boolean
              ? { toggle: true }
              : { result: '' }),
          };
        }
      );

    booking.bookingDetails = { toggleQuestion } as BookingDetails;

    if (rand.int(1, 2) === 1) {
      booking.dateCheckedIn = dayjs().toDate();
    }
  }

  return booking;
});
