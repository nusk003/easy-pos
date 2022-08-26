import { Availability, DaysTime } from '@hm/sdk';
import dayjs from 'dayjs';

const days = ['s', 'm', 't', 'w', 'th', 'f', 'sa'] as const;

export const getDayIndex = (date = new Date()) => {
  return Number(dayjs(date).format('d'));
};

export const getDayAvailability = (
  availability: Availability,
  date: Date = new Date()
) => {
  const dayIndex = getDayIndex(date);
  return availability[days[dayIndex]] || undefined;
};

export const parseDaysTimeToHoursMinutes = (daysTime: DaysTime) => {
  const start = daysTime.start;
  const end = daysTime.end;

  return {
    start: {
      minutes: Number(start.split(':')[1]),
      hours: Number(start.split(':')[0]),
    },
    end: {
      minutes: Number(end.split(':')[1]),
      hours: Number(end.split(':')[0]),
    },
  };
};

export const parseDaysTimeToHours = (daysTime: DaysTime) => {
  const start = daysTime.start;
  const end = daysTime.end;

  return {
    start: Number(start.split(':')[0]) + Number(start.split(':')[1]) / 60,
    end: Number(end.split(':')[0]) + Number(end.split(':')[1]) / 60,
  };
};

export const isAvailable = (availability: Availability, date = new Date()) => {
  const dayAvailability = getDayAvailability(availability, date);

  if (!dayAvailability) {
    return false;
  }

  const { start, end } = parseDaysTimeToHoursMinutes(dayAvailability);

  const check = dayjs(date);
  const minimumDate = dayjs(check).hour(start.hours).minute(start.minutes);
  const maximumDate = dayjs(check).hour(end.hours).minute(end.minutes);

  return check.isAfter(minimumDate) && check.isBefore(maximumDate);
};

export const formatMeridiemTime = (date = new Date()) => {
  if (dayjs(date).minute() === 0) {
    return dayjs(date).format('ha');
  }

  return dayjs(date).format('h:mma');
};

export const formatAvailabilityText = (
  availability: Availability,
  date = new Date()
) => {
  let dayAvailability = getDayAvailability(availability, date);

  if (isAvailable(availability)) {
    const { end } = parseDaysTimeToHoursMinutes(dayAvailability!);
    const closingTime = formatMeridiemTime(
      dayjs(date).hour(end.hours).minute(end.minutes).toDate()
    );

    return `Available until ${closingTime}`;
  }

  if (dayAvailability) {
    const { start } = parseDaysTimeToHoursMinutes(dayAvailability!);
    const minTime = dayjs(date).hour(start.hours).minute(start.minutes);

    if (minTime.isAfter(date)) {
      const minutesUntil = minTime.diff(date, 'minutes');

      if (minutesUntil < 60) {
        return `Available in ${minutesUntil} ${
          minutesUntil === 1 ? 'minute' : 'minutes'
        }`;
      }

      const hoursUntil = Math.round(minutesUntil / 60);

      return `Available in ${hoursUntil} ${
        hoursUntil === 1 ? 'hour' : 'hours'
      }`;
    }
  }

  let newDate = dayjs(date).add(1, 'day').toDate();

  const nextDayAvailability = getDayAvailability(availability, newDate);

  if (nextDayAvailability) {
    const { start } = parseDaysTimeToHoursMinutes(nextDayAvailability!);
    const openingTime = formatMeridiemTime(
      dayjs(date).hour(start.hours).minute(start.minutes).toDate()
    );

    return `Available from ${openingTime} tomorrow`;
  }

  let nextOpeningTime = '';
  for (let i = 0; i < 5; i += 1) {
    newDate = dayjs(newDate).add(1, 'day').toDate();
    dayAvailability = getDayAvailability(availability, newDate);

    if (dayAvailability) {
      const { start } = parseDaysTimeToHoursMinutes(dayAvailability!);
      const openingTime = formatMeridiemTime(
        dayjs(date).hour(start.hours).minute(start.minutes).toDate()
      );

      nextOpeningTime = `Available from ${openingTime} ${dayjs(newDate).format(
        'dddd'
      )}`;
      break;
    }
  }

  return nextOpeningTime;
};

export const formatFutureAvailabilityText = (
  availability: Availability,
  date: Date
) => {
  if (isAvailable(availability, date)) {
    const dayAvailability = getDayAvailability(availability, date);

    const { start, end } = parseDaysTimeToHoursMinutes(dayAvailability!);
    const openingTime = formatMeridiemTime(
      dayjs(date).hour(start.hours).minute(start.minutes).toDate()
    );
    const closingTime = formatMeridiemTime(
      dayjs(date).hour(end.hours).minute(end.minutes).toDate()
    );
    return `Available from ${openingTime} - ${closingTime}`;
  }

  return `Closed on ${dayjs(date).format('dddd')}`;
};
