import { __main_hotel_id__ } from '@dev/seed-data/constants';
import {
  BookingInstructionsDisplayType,
  Hotel,
  PayoutsStrategy,
  ReminderDurationType,
} from '@src/modules/hotel/entities';
import { ObjectId } from 'mongodb';
import { mainGroup } from './groups.factory';

enum CustomFieldType {
  String = 'String',
  Boolean = 'Boolean',
}

export const mainHotel = new Hotel();
mainHotel._id = __main_hotel_id__;
mainHotel.name = 'Spark Electro';
mainHotel.telephone = '07123456789';
mainHotel.address = {
  country: 'United Kingdom',
  postalCode: 'BH2 6BB',
  line1: 'Elah London',
  line2: 'Queens Road',
  town: 'London',
  coordinates: {
    lat: 51.504311,
    lng: -0.15216,
  },
};
mainHotel.website = 'www.hotelmanager.co';
mainHotel.currencyCode = 'LKR';
mainHotel.countryCode = 'GB';
mainHotel.group = mainGroup;
mainHotel.messagesSettings = {
  enabled: true,
  awayMessage: {
    message:
      'Please leave a message and we’ll get back to you as soon as we can!',
    showTime: true,
  },
  availability: {
    m: {
      start: '09:00',
      end: '18:00',
    },
    t: {
      start: '09:00',
      end: '18:00',
    },
    w: {
      start: '09:00',
      end: '18:00',
    },
    th: {
      start: '09:00',
      end: '18:00',
    },
    f: {
      start: '09:00',
      end: '18:00',
    },
    sa: {
      start: '09:00',
      end: '18:00',
    },
  },
};
mainHotel.payouts = {
  enabled: PayoutsStrategy.Stripe,
  stripe: {
    accountId: 'acct_1HC3XvEx8WJxZYoS',
    dateCreated: new Date('2020-08-03T13:17:45.294Z'),
  },
};
mainHotel.bookingsSettings = {
  enabled: true,
  maxPartySize: 10,
  arrival: {
    entryMethods: {
      appKey: false,
      frontDesk: true,
    },
    instructions: {
      display: BookingInstructionsDisplayType.Bulleted,
      steps: [
        'When you arrive, please show your confirmation to the front desk along with your ID documents',
        'Your keys will be provided to you in a sanitised bag for your own safety',
        'The front desk will help you locate your room. We hope you enjoy your stay',
      ],
    },
  },
  maxNumberOfRooms: 4,
  checkInTime: '10:00',
  checkOutTime: '22:00',
  contactMethods: {
    appMessaging: true,
    email: true,
    phoneNumber: false,
  },
  customization: {
    checkInStart: {
      title: 'Welcome',
      message:
        'We can’t wait to welcome you here at Elah The Bay. Check in for your stay by completing the following steps.',
    },
    checkInReview: {
      title: 'Check-in is awaiting review',
      message:
        'You have submitted your check-in details for review. We will get back to you shortly!',
    },
    checkInSuccess: {
      title: 'Check-in review successful',
      message:
        'You have successfully checked in for your stay at Elah The Bay. We look forward to welcoming you!',
    },
    checkInUnsuccessful: {
      title: 'Unable to check in via app',
      message:
        'We were unable to verify all your check-in details, please arrive at the front desk to complete check-in.',
    },
  },
  departure: {
    notifications: {
      email: false,
      app: true,
      reminders: [{ duration: ReminderDurationType.Minutes, value: 10 }],
    },
  },
  preArrival: {
    email: true,
    fields: {
      address: true,
      bookingReference: true,
      clubMemberNumber: true,
      company: true,
      countryOfResidence: true,
      dateOfBirth: true,
      datesOfStay: true,
      dietaryRequirements: true,
      estimatedTimeOfArrival: true,
      job: true,
      name: true,
      passportNumber: false,
      nationality: true,
      numberOfAdults: true,
      numberOfChildren: true,
      passportScan: true,
      customFields: [
        {
          title: 'Daily News Papers',
          type: CustomFieldType.Boolean,
        },
        {
          title: 'Dinner reservation',
          type: CustomFieldType.Boolean,
        },
      ],
      specialOccasions: true,
      party: {
        adult: {
          address: true,
          company: true,
          countryOfResidence: true,
          dateOfBirth: true,
          dietaryRequirements: true,
          email: true,
          foreignNationalNextDestination: true,
          foreignNationalPassportNumber: true,
          job: true,
          mobile: true,
          name: true,
          nationality: true,
          nextDestination: true,
          passportNumber: true,
        },
        child: {
          address: true,
          countryOfResidence: true,
          dateOfBirth: true,
          dietaryRequirements: true,
          email: true,
          foreignNationalPassportNumber: true,
          mobile: true,
          name: true,
          nationality: true,
          passportNumber: true,
        },
      },
    },
    minHoursBeforeCheckIn: 2,
    notifications: {
      reminders: [{ duration: ReminderDurationType.Minutes, value: 10 }],
      email: true,
      app: true,
    },
    terms: [
      {
        message: 'the terms and conditions',
        link: 'https://hotelmanager.co',
      },
    ],
  },
};
mainHotel.app = mainGroup.app;
mainHotel.app!.metadata!.title = 'Elah the Bay: Staging';
mainHotel.deleted = false;

export const emptyHotel = new Hotel();
emptyHotel._id = new ObjectId('5f6c5ab1074e35d7ab726d41');
emptyHotel.name = 'Test Hotel';
emptyHotel.telephone = '07987654321';
emptyHotel.countryCode = 'GB';
emptyHotel.currencyCode = 'LKR';
emptyHotel.address = {
  country: 'United Kingdom',
  postalCode: 'EX20 1FN',
  line1: 'Test Hotel',
  line2: 'Hotel Road',
  town: 'Okehampton',
  coordinates: {
    lat: 6.9054502,
    lng: 79.8515023,
  },
};
emptyHotel.website = 'www.testhotel.com';
emptyHotel.app = {
  versionCode: 2,
  metadata: {
    title: 'Test Hotel',
  },
};
emptyHotel.group = mainGroup;
emptyHotel.deleted = false;

export const hotels = [mainHotel, emptyHotel];
