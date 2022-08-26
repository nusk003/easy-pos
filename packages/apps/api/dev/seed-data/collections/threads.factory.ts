import { guestIds, __no_guests__ } from '@dev/seed-data/constants';
import { faker, rand } from '@dev/seed-data/util';
import { Guest } from '@src/modules/guest/guest.entity';
import { Message, MessageAuthor } from '@src/modules/message/message.entity';
import { Thread } from '@src/modules/thread/thread.entity';
import { User } from '@src/modules/user/user.entity';
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { mainGroup } from './groups.factory';
import { mainGuest } from './guests.factory';
import { mainHotel } from './hotels.factory';
import { hmUser } from './users.factory';

dayjs.extend(utc);

export const messages: Message[] = [];

export const mainMessages = [
  {
    _id: new ObjectId('6015ef25d9f6792342a67eb3'),
    text: 'Hi there, is an iron available?',
    dateCreated: dayjs().subtract(12, 'minute').toDate(),
    author: MessageAuthor.Guest,
  },
  {
    _id: new ObjectId('6015ef207d1e2e50426a001a'),
    text: 'Is there an iron available?',
    dateCreated: dayjs().subtract(7, 'minute').toDate(),
    author: MessageAuthor.Guest,
  },
  {
    _id: new ObjectId('6015ef1b256333b3d784ae83'),
    text: 'Apologies for the slight delay, Mr.Wanderwall',
    dateCreated: dayjs().subtract(6, 'minute').toDate(),
    user: hmUser,
    author: MessageAuthor.User,
  },
  {
    _id: new ObjectId('6015ef02934b8172504a0a7a'),
    text: 'Yes, I can have one sent to your room straight away!',
    dateCreated: dayjs().subtract(6, 'minute').toDate(),
    user: hmUser,
    author: MessageAuthor.User,
  },
].map((m) => {
  const message = new Message();
  message._id = m._id;
  message.user = m.user;
  message.text = m.text;
  message.dateCreated = m.dateCreated;
  message.dateUpdated = m.dateCreated;
  message.author = m.author;

  message.group = mainGroup;
  message.hotel = mainHotel;

  messages.push(message);

  return message;
});

export const mainThread = new Thread();
mainThread._id = new ObjectId('6015ef3c292b90e0dcafae07');
mainThread.messages.add(...mainMessages);
mainThread.resolved = false;
mainThread.hotel = mainHotel;
mainThread.group = mainGroup;
mainThread.guest = mainGuest;

const generateMessage = (date: Date, guest: Guest, user: User | undefined) => {
  const message = new Message();

  message.text = faker.lorem.sentence();
  message.group = mainGroup;
  message.hotel = mainHotel;
  message.author = user ? MessageAuthor.User : MessageAuthor.Guest;
  message.guest = guest;

  if (message.author === MessageAuthor.User) {
    message.user = user;
  }

  message.dateCreated = date;
  message.dateUpdated = date;

  return message;
};

const generateMessages = (date: Date, guest: Guest) => {
  let lastDate: Date | undefined;

  const authors = [...Array(rand.int(6, 15)).keys()].map(() => {
    return rand.int(0, 1) === 1 ? MessageAuthor.Guest : MessageAuthor.User;
  });

  const dates = authors.map((author, idx) => {
    if (!lastDate) {
      lastDate = date;
      return date;
    }

    const offset = idx === 0 || author === authors[idx - 1] ? 60 : 600;
    const dateCreated = dayjs(lastDate)
      .add(rand.int(0, offset), 'seconds')
      .toDate();
    lastDate = dateCreated;
    return dateCreated;
  });

  const messages = dates.map((dateCreated, idx) => {
    return generateMessage(
      dateCreated,
      guest,
      authors[idx] === MessageAuthor.User ? hmUser : undefined
    );
  });

  return messages;
};

const generateThreadTimestamp = (date: Date) => {
  const mealTimeParameters = [
    { meal: 'morning', mu: 9.5, sigma: 0.4 },
    { meal: 'afternoon', mu: 13, sigma: 0.6 },
    { meal: 'evening', mu: 19, sigma: 0.8 },
  ];

  const mealType =
    mealTimeParameters[rand.int(0, mealTimeParameters.length - 1)];
  const hours = rand.normal(mealType.mu, mealType.sigma)();

  if (dayjs(date).utc().startOf('day').isSame(dayjs().utc().startOf('day'))) {
    const hoursTillNow =
      dayjs().diff(dayjs().utc().startOf('day')) / (1000 * 60 * 60);

    if (hours > hoursTillNow) {
      return null;
    }
  }

  return dayjs(date).add(hours, 'hours').toDate();
};

const generateThread = (date: Date) => {
  const thread = new Thread();

  thread.guest = guestIds[rand.int(0, __no_guests__ - 1)] as unknown as Guest;

  const isToday = dayjs(date)
    .utc()
    .startOf('day')
    .isSame(dayjs().utc().startOf('day'));

  const dateCreated = generateThreadTimestamp(date);

  if (!dateCreated) {
    return null;
  }

  thread.dateCreated = dateCreated;

  let lastDate = dateCreated;
  const dates = [...Array(rand.int(6, 15)).keys()].map(() => {
    const dateCreated = dayjs(lastDate)
      .add(rand.int(0, 600), 'seconds')
      .toDate();
    lastDate = dateCreated;
    return dateCreated;
  });
  dates.unshift(dateCreated);

  const messages = generateMessages(dateCreated, thread.guest);

  thread.messages.add(...messages);

  thread.dateUpdated = messages.pop()!.dateUpdated;

  thread.resolved = !isToday || rand.int(1, 2) === 1;

  thread.hotel = mainHotel;
  thread.group = mainGroup;

  return thread;
};

const generateThreads = () => {
  const threads: Thread[] = [];
  const noDays = 30;
  for (let i = noDays; i >= 0; i--) {
    const noThreads = rand.binomial(50, 0.2)();
    threads.push(
      ...([...Array(noThreads).keys()]
        .map(() => {
          return generateThread(
            dayjs().utc().startOf('day').subtract(i, 'days').toDate()
          );
        })
        .filter(Boolean) as Thread[])
    );
  }
  return threads;
};

export const threads = generateThreads();
