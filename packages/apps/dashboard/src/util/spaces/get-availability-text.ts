import { Availability } from '@hm/sdk';
import { format } from '@src/util/format';

export const getAvailabilityText = (availability: Availability) => {
  let availabilityText = '';

  Object.entries(availability).forEach(([day, times]) => {
    const dayTime = typeof times === 'object' ? times : undefined;

    if (dayTime) {
      availabilityText += `${format.capitalize(day)}: ${dayTime.start} - ${
        dayTime.end
      }\n`;
    } else {
      availabilityText += `${format.capitalize(day)}: Closed\n`;
    }
  });

  return availabilityText;
};
