import { guestIds } from '@dev/seed-data/constants';
import { Guest } from '@src/modules/guest/guest.entity';
import { MessageAuthor } from '@src/modules/message/message.entity';
import { ObjectId } from 'mongodb';
import { faker, rand } from '@dev/seed-data/util';
import { v4 as uuid } from 'uuid';
import { mainHotel } from './hotels.factory';
import { mainOrder } from './orders.factory';
import { mainThread } from './threads.factory';
import { epUser } from './users.factory';

export const mainGuest = new Guest();
mainGuest._id = new ObjectId('5f37cca8d8c7e93f50c10034');
mainGuest.email = 'alex.wanderwall@mail.com';
mainGuest.firstName = 'Alex';
mainGuest.lastName = 'Wanderwall';
mainGuest.mobile = '7123456789';
mainGuest.mobileCountryCode = 'GB';
mainGuest.deviceId = '399af8fd-8817-443c-8999-03d4a499853c';
mainGuest.pushNotifications = [
  {
    hotel: mainHotel._id,
    tokens: ['ExponentPushToken[zp99G-J1MbjQlXGxFUBfpZ]'],
  },
];
mainGuest.hotels.add(mainHotel);
mainGuest.orders.add(mainOrder);
mainGuest.threads.add(mainThread);
mainGuest.threads.getItems().forEach((thread) => {
  thread.messages.getItems().forEach((message) => {
    message.guest = mainGuest;
    message.user = message.author === MessageAuthor.User ? epUser : undefined;
  });
});

export const guests = [
  mainGuest,
  ...guestIds.map((id) => {
    const guest = new Guest();
    guest._id = id;
    guest.firstName = faker.name.firstName();
    guest.lastName = faker.name.lastName();
    guest.email = `${guest.firstName.toLowerCase()}.${guest.lastName.toLowerCase()}@mail.com`;
    guest.mobile =
      rand.int(50) === 1
        ? undefined
        : `7${faker.phone.phoneNumberFormat(0).replace(/-/g, '').slice(1)}`;
    guest.mobileCountryCode = guest.mobile ? 'GB' : undefined;
    guest.deviceId = uuid();
    guest.hotels.add(mainHotel);

    return guest;
  }),
];
