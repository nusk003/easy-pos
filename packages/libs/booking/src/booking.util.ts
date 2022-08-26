import { Booking } from '@hm/sdk';
import { formatSpaceDate } from '@hm/spaces';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import nationalities from 'i18n-nationality';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js';

dayjs.extend(utc);

nationalities.registerLocale(require('i18n-nationality/langs/en.json'));

export const getBookingTime = (booking: Booking) => {
  const timeElapsed =
    (Number(new Date()) - Number(new Date(booking.dateCreated))) / 1000;

  let bookingDate = '';

  if (timeElapsed < 120) {
    bookingDate = 'just now';
  } else if (timeElapsed < 3600) {
    bookingDate = `${Math.floor(timeElapsed / 60)} mins`;
  } else if (timeElapsed < 86400) {
    bookingDate = `${Math.floor(timeElapsed / 3600)} hours`;
  } else if (timeElapsed < 86400 * 7) {
    bookingDate = `${Math.floor(timeElapsed / 86400)} days`;
  } else {
    bookingDate = formatSpaceDate(new Date(booking.dateCreated));
  }

  return bookingDate;
};

export const getNights = (booking: Booking) => {
  const arrivalMoment = dayjs(booking?.checkInDate).utc(true).startOf('day');
  const departureMoment = dayjs(booking?.checkOutDate).utc(true).startOf('day');
  const nights = departureMoment.diff(arrivalMoment, 'days');
  return nights;
};

export const getNationality = (countryCode: string) => {
  return nationalities.getName(countryCode, 'en');
};

export const getCountryCode = (countryName: string) => {
  return nationalities.getAlpha2Code(countryName, 'en');
};

export const validatePassport = (passportNumber: string) => {
  return passportNumber.length === 9;
};

export const validateMobile = (phoneNumber: string, countryCode: string) => {
  return isValidPhoneNumber(phoneNumber, countryCode as CountryCode);
};
