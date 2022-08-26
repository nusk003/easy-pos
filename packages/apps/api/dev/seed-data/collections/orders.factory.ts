import { guestIds, __no_guests__ } from '@dev/seed-data/constants';
import { rand } from '@dev/seed-data/util';
import { Guest } from '@src/modules/guest/guest.entity';
import { Order, OrderItem, PaymentType } from '@src/modules/order/order.entity';
import { PricelistDeliveryType } from '@src/modules/pricelist/pricelist.entity';
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { customAlphabet } from 'nanoid';
import { mainGroup } from './groups.factory';
import { mainGuest } from './guests.factory';
import { mainHotel } from './hotels.factory';
import { pricelist } from './pricelists.factory';
import { space } from './spaces.factory';

dayjs.extend(utc);

const nanoid = customAlphabet('123456789abcdefhjknopqrtuv', 6);

const generateOrderItem = (categoryIndex?: number) => {
  const catIndex =
    categoryIndex ?? rand.int(0, pricelist.catalog!.categories.length - 1);
  const category = pricelist.catalog!.categories[catIndex];
  const item = category.items[rand.int(0, category.items.length - 1)];
  return {
    id: item.id,
    name: item.name,
    categoryId: category.id,
    modifiers: [],
    roomServicePrice: item.roomServicePrice,
    regularPrice: <never>undefined,
    quantity: rand.int(1, 2),
    get totalPrice(): number {
      return Number((this.quantity * this.roomServicePrice).toFixed(2));
    },
  };
};

const generateOrderItems = (orderSize: number) => {
  const items: OrderItem[] = [];
  const categoryQuantities = [
    {
      category: 'forTheTable',
      quantity: rand.binomial(orderSize || 4, 0.3)(),
      index: 0,
    },
    {
      category: 'smallPlates',
      quantity: rand.binomial(orderSize || 4, 0.3)(),
      index: 1,
    },
    { category: 'mains', quantity: orderSize, index: 2 },
    {
      category: 'sides',
      quantity: rand.binomial(orderSize || 4, 0.3)(),
      index: 3,
    },
    {
      category: 'desserts',
      quantity: rand.binomial(orderSize || 4, 0.3)(),
      index: 4,
    },
  ];

  categoryQuantities.forEach(({ quantity, index }) => {
    if (quantity > 0) {
      items.push(
        ...[...Array(quantity).keys()].map(() => {
          return generateOrderItem(index);
        })
      );
    }
    return;
  });

  return items;
};

const generateOrderTimestamp = (date: Date) => {
  const mealTimeParameters = [
    { meal: 'breakfast', mu: 9.5, sigma: 0.4 },
    { meal: 'lunch', mu: 13, sigma: 0.6 },
    { meal: 'dinner', mu: 19, sigma: 0.8 },
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

export const generateOrder = (date: Date) => {
  const order = new Order();
  order._id = new ObjectId();
  order.space = space;
  order.pricelist = pricelist;
  order.items = generateOrderItems(rand.int(0, 4));
  order.roomNumber = String(rand.int(5, 200));
  order.notes = rand.int(1, 10) === 1 ? 'Bring extra napkins' : undefined;
  order.orderReference = nanoid();
  order.paymentType =
    rand.int(1, 2) === 1 ? PaymentType.Cash : PaymentType.RoomBill;
  order.group = mainGroup;
  order.hotel = mainHotel;

  order.guest = guestIds[rand.int(0, __no_guests__ - 1)] as unknown as Guest;

  const isToday = dayjs(date)
    .utc()
    .startOf('day')
    .isSame(dayjs().utc().startOf('day'));

  const dateCreated = generateOrderTimestamp(date);

  if (!dateCreated) {
    return null;
  }

  order.dateCreated = dateCreated;
  order.dateScheduled =
    rand.int(1, 10) === 1
      ? dayjs()
          .add(rand.int(1, 6) / 2, 'hours')
          .toDate()
      : undefined;
  order.dateApproved =
    !isToday || rand.int(0, 1) === 1
      ? dayjs(order.dateCreated).add(rand.int(0, 10), 'minutes').toDate()
      : undefined;
  order.dateReady =
    !isToday || (order.dateApproved && rand.int(0, 1) === 1)
      ? dayjs(order.dateApproved).add(rand.int(0, 60), 'minutes').toDate()
      : undefined;
  order.dateCompleted =
    !isToday || (order.dateReady && rand.int(0, 1) === 1)
      ? dayjs(order.dateReady).add(rand.int(0, 15), 'minutes').toDate()
      : undefined;
  order.dateUpdated =
    order.dateCompleted ||
    order.dateReady ||
    order.dateReady ||
    order.dateApproved ||
    order.dateCreated;

  order.subtotal = Number(
    order.items
      .reduce((total: number, item) => total + item.totalPrice, 0)
      .toFixed(2)
  );

  order.totalPrice = Number(
    (order.discount
      ? order.subtotal * (1 - order.discount.value)
      : order.subtotal
    ).toFixed(2)
  );

  order.paid =
    dayjs(date).utc().isBefore(dayjs().subtract(7, 'days').startOf('day')) ||
    rand.int(1, 2) === 1;

  order.delivery =
    rand.int(1, 2) === 1
      ? PricelistDeliveryType.Room
      : PricelistDeliveryType.Table;

  order.feedback =
    rand.int(1, 4) === 1 ? { rating: rand.int(4, 5) } : undefined;

  return order;
};

const generateOrders = () => {
  const orders: Order[] = [];
  const noDays = 120;
  for (let i = noDays; i >= 0; i--) {
    const noOrders = rand.binomial(50, 0.2)();
    orders.push(
      ...([...Array(noOrders).keys()]
        .map(() => {
          return generateOrder(
            dayjs().utc().startOf('day').subtract(i, 'days').toDate()
          );
        })
        .filter(Boolean) as Order[])
    );
  }
  return orders;
};

export const mainOrder = new Order();
mainOrder._id = new ObjectId('5f4e3d214509ea2725b4468e');
mainOrder.guest = mainGuest;
mainOrder.space = space;
mainOrder.pricelist = pricelist;
mainOrder.dateCreated = new Date('2020-09-16T07:17:57.218Z');
mainOrder.items = [
  {
    id: pricelist.catalog!.categories[0].items[0].id,
    name: pricelist.catalog!.categories[0].items[0].name,
    modifiers: [],
    roomServicePrice:
      pricelist.catalog!.categories[0].items[0].roomServicePrice,
    quantity: 1,
    totalPrice: Number(
      pricelist.catalog!.categories[0].items[0].roomServicePrice.toFixed(2)
    ),
  },
];
mainOrder.totalPrice = Number(
  pricelist.catalog!.categories[0].items[0].roomServicePrice.toFixed(2)
);
mainOrder.roomNumber = '8';
mainOrder.orderReference = '23f1fe';
mainOrder.dateScheduled = new Date('2020-09-16T08:12:57.221Z');
mainOrder.paymentType = PaymentType.Cash;
mainOrder.subtotal = 18;
mainOrder.dateApproved = new Date('2020-09-16T07:47:57.221Z');
mainOrder.dateReady = new Date('2020-09-16T08:07:57.221Z');
mainOrder.dateCompleted = new Date('2020-09-16T08:17:57.221Z');
mainOrder.paid = true;
mainOrder.hotel = mainHotel;
mainOrder.group = mainGroup;
mainOrder.delivery = PricelistDeliveryType.Room;
mainOrder.feedback = { rating: 4 };

export const orders = generateOrders();
