import {
  Pricelist,
  PricelistDeliveryType,
  PricelistMultiplierType,
} from '@src/modules/pricelist/pricelist.entity';
import { ObjectId } from 'mongodb';
import { mainGroup } from './groups.factory';
import { mainHotel } from './hotels.factory';
import { space } from './spaces.factory';

export const pricelist = new Pricelist();

pricelist._id = new ObjectId('5e7b1932dad63100084f409b');
pricelist.name = 'Main menu';
pricelist.description =
  'Regardless of whether you are after light refreshment or a full dining experience,  The Quarterdeck restaurant will appeal to all tastes and appetites. We aspire to make the most of our prime location in the Garden of England by using as much seasonal and local produce as possible.';
pricelist.commerce = true;
pricelist.delivery = [
  {
    enabled: true,
    type: PricelistDeliveryType.Table,
  },
];
pricelist.promotions = {
  discounts: [
    {
      id: '91c6936a-dc58-41ee-8ce3-95de25c70968',
      name: '10% off when you order through the app',
      value: 0.1,
      count: 0,
      delivery: [
        { type: PricelistDeliveryType.Room, enabled: true },
        { type: PricelistDeliveryType.Table, enabled: true },
      ],
      type: PricelistMultiplierType.Percentage,
    },
  ],
};
pricelist.surcharges = [];
pricelist.enabledPayments = {
  card: true,
  roomBill: true,
  cash: true,
};

pricelist.availability = {
  m: {
    start: '09:00',
    end: '22:00',
  },
  t: {
    start: '09:00',
    end: '22:00',
  },
  w: {
    start: '09:00',
    end: '22:00',
  },
  th: {
    start: '09:00',
    end: '22:00',
  },
  f: {
    start: '09:00',
    end: '22:00',
  },
  sa: {
    start: '09:00',
    end: '22:00',
  },
  s: {
    start: '09:00',
    end: '22:00',
  },
};

pricelist.catalog = {
  categories: [
    {
      id: 'a1b81ee0-530d-11ea-b801-7b9e59bfd88b',
      name: 'For the table',
      items: [
        {
          id: 'b4975bc0-530d-11ea-b801-7b9e59bfd88b',
          name: 'Moroccan houmous with chives',
          description: 'With fresh warm wholegrain pitta bread',
          regularPrice: 4.5,
          roomServicePrice: 4.5,
          modifiers: [
            {
              id: 'c3ddbe99-ddb3-4c01-a1c2-734c31512f64',
              name: 'Choose a size',
              maxSelection: 1,
              options: [
                {
                  id: 'b0d5797d-a037-4b1a-a3da-e8384851a9e0',
                  name: 'Small',
                  price: 0,
                },
                {
                  id: '514adbed-849f-421f-85ee-d40256f728ec',
                  name: 'Medium',
                  price: 1,
                },
                {
                  id: '9394c7a3-f1b9-4783-b412-93d29b2ae37d',
                  name: 'Large',
                  price: 2,
                },
              ],
              required: true,
            },
          ],
          labels: [
            {
              name: 'g',
              id: '56396130-530e-11ea-b801-7b9e59bfd88b',
            },
            {
              name: 'vg',
              id: 'bd47eff0-530d-11ea-b801-7b9e59bfd88b',
            },
            {
              name: 'v',
              id: 'bb1f6aa0-530d-11ea-b801-7b9e59bfd88b',
            },
          ],
        },
        {
          id: 'c93c6480-530d-11ea-b801-7b9e59bfd88b',
          name: 'Marinated giant green olives',
          labels: [
            {
              name: 'g',
              id: '56396130-530e-11ea-b801-7b9e59bfd88b',
            },
            {
              name: 'vg',
              id: 'bd47eff0-530d-11ea-b801-7b9e59bfd88b',
            },
            {
              name: 'v',
              id: 'bb1f6aa0-530d-11ea-b801-7b9e59bfd88b',
            },
          ],
          regularPrice: 3.95,
          roomServicePrice: 3.95,
          modifiers: [],
        },
        {
          id: 'd2d583f0-530d-11ea-b801-7b9e59bfd88b',
          name: 'Beetroot tzatziki with chives',
          labels: [
            {
              name: 'g',
              id: '56396130-530e-11ea-b801-7b9e59bfd88b',
            },
            {
              name: 'vg',
              id: 'bd47eff0-530d-11ea-b801-7b9e59bfd88b',
            },
            {
              name: 'v',
              id: 'bb1f6aa0-530d-11ea-b801-7b9e59bfd88b',
            },
          ],
          description: 'With warm grain pitta bread',
          regularPrice: 4.5,
          roomServicePrice: 4.5,
          modifiers: [],
        },
      ],
    },
    {
      id: 'e4af5ec0-530d-11ea-b801-7b9e59bfd88b',
      name: 'Small plates',
      items: [
        {
          id: 'ea3d5630-530d-11ea-b801-7b9e59bfd88b',
          name: 'Roast tandoori spiced cauliflower florets',
          description:
            'On tahini soya yoghurt topped with pickled red cabbage, pomegranate molasses, coriander & pumpkin seeds',
          regularPrice: 5.75,
          roomServicePrice: 5.75,
          modifiers: [],
          labels: [
            {
              name: 'g',
              id: '56396130-530e-11ea-b801-7b9e59bfd88b',
            },
            {
              name: 'vg',
              id: 'bd47eff0-530d-11ea-b801-7b9e59bfd88b',
            },
            {
              name: 'v',
              id: 'bb1f6aa0-530d-11ea-b801-7b9e59bfd88b',
            },
          ],
        },
        {
          id: 'f4754db0-530d-11ea-b801-7b9e59bfd88b',
          name: 'Tiger prawns in the shell',
          description:
            'Sautéed with garlic & ginger and tossed in a brown shrimp & peanut sauce with a side of turmeric & poppy seed bread',
          regularPrice: 8.5,
          roomServicePrice: 8.5,
          modifiers: [],
        },
        {
          id: '0541fe40-530e-11ea-b801-7b9e59bfd88b',
          name: 'Crispy salt and pepper dusted squid',
          description:
            'Hand cut and lightly coated in seasoned flour with a dipping pot of roast garlic and thyme mayonnaise',
          regularPrice: 6.25,
          roomServicePrice: 6.25,
          modifiers: [],
        },
        {
          id: '167e87a0-530e-11ea-b801-7b9e59bfd88b',
          name: 'Pan seared British scallops',
          description:
            'Lightly pan seared and served on butternut, pear and nutmeg purée with roasted butternut and butternut crisps',
          regularPrice: 9.95,
          roomServicePrice: 9.95,
          modifiers: [],
          labels: [
            {
              name: 'g',
              id: '56396130-530e-11ea-b801-7b9e59bfd88b',
            },
            {
              name: 'vg',
              id: 'bd47eff0-530d-11ea-b801-7b9e59bfd88b',
            },
            {
              name: 'v',
              id: 'bb1f6aa0-530d-11ea-b801-7b9e59bfd88b',
            },
          ],
        },
        {
          id: '59c5e350-530e-11ea-b801-7b9e59bfd88b',
          name: 'Chicken liver & forest mushroom parfait',
          description:
            'Toasted sourdough, dressed leaves & balsamic onion confit',
          regularPrice: 6.5,
          roomServicePrice: 6.5,
          modifiers: [],
        },
        {
          id: '6570cbc0-530e-11ea-b801-7b9e59bfd88b',
          name: 'Roasted tomato and thyme soup',
          labels: [
            {
              name: 'g',
              id: '56396130-530e-11ea-b801-7b9e59bfd88b',
            },
            {
              name: 'vg',
              id: 'bd47eff0-530d-11ea-b801-7b9e59bfd88b',
            },
            {
              name: 'v',
              id: 'bb1f6aa0-530d-11ea-b801-7b9e59bfd88b',
            },
          ],
          description:
            'Topped with crispy fried onions and sour cream with sourdough bread on the side',
          regularPrice: 5.5,
          roomServicePrice: 5.5,
          modifiers: [],
        },
      ],
    },
    {
      id: '927c2b00-530e-11ea-b801-7b9e59bfd88b',
      name: 'Mains',
      items: [
        {
          id: '9aa2a7a0-530e-11ea-b801-7b9e59bfd88b',
          name: 'Traditional cod and chips',
          description:
            'Fresh from our fish monger; a large cod fillet hand coated in our own Shepherd Neame ale crispy batter with chips and peas',
          regularPrice: 12.95,
          roomServicePrice: 12.95,
          modifiers: [],
        },
        {
          id: 'a2795690-530e-11ea-b801-7b9e59bfd88b',
          name: 'Golden breaded wholetail scampi',
          description:
            'With a pile of chunky chips, seasonal leaves, tartare sauce and lime wedge',
          regularPrice: 11.5,
          roomServicePrice: 11.5,
          modifiers: [],
        },
        {
          id: 'aeeb3880-530e-11ea-b801-7b9e59bfd88b',
          name: 'Brazilian fish stew',
          description:
            'Mussels and chunky pieces of salmon, cod and smoked haddock in a rich spicy tomato & coconut broth with pilau rice and dressed leaves',
          regularPrice: 11.95,
          roomServicePrice: 11.95,
          modifiers: [],
        },
        {
          id: 'ba353c40-530e-11ea-b801-7b9e59bfd88b',
          name: 'Prawn, chorizo and crab linguine',
          description:
            'In a creamy sun blushed tomato pesto sauce, topped with rocket and parmesan',
          regularPrice: 11.95,
          roomServicePrice: 11.95,

          modifiers: [],
        },
        {
          id: 'c3383630-530e-11ea-b801-7b9e59bfd88b',
          name: 'Pan fried stone bass with watercress sauce',
          description:
            'Served with soy bean risotto, mussels and a crumbed prawn',
          regularPrice: 15.95,
          roomServicePrice: 15.95,

          modifiers: [],
        },
        {
          id: 'ce98a820-530e-11ea-b801-7b9e59bfd88b',
          name: 'Pan seared salmon fillet',
          description:
            'With a creamy lobster sauce, buttered new potatoes, green beans, samphire and finished with a peanut & shrimp butter',
          regularPrice: 14.95,
          roomServicePrice: 14.95,

          modifiers: [],
        },
        {
          id: 'd8b0bb90-530e-11ea-b801-7b9e59bfd88b',
          name: 'Wild mushroom risotto',
          description: 'Finished with soya beans and pickled mushrooms',
          regularPrice: 9.95,
          roomServicePrice: 9.95,

          modifiers: [],
        },
        {
          id: 'f1328950-530e-11ea-b801-7b9e59bfd88b',
          name: 'Pork & Biddenden apple sausages and mash',
          description:
            'Our sausages are from local butcher Joseph & Henry and are served with seasonal vegetables, beer braised onions and a rich gravy',
          regularPrice: 10.5,
          roomServicePrice: 10.5,

          modifiers: [],
        },
        {
          id: 'f9d64c40-530e-11ea-b801-7b9e59bfd88b',
          name: '8oz Sirloin steak',
          description:
            'A great marbled steak, succulent and full of flavour. Our steaks are sourced from British farms and matured for a minimum of 28 days to provide taste and tenderness. Chargrilled to your liking with herb butter, a rocket, pickled fennel, shallot and semi dried tomato salad & chips',
          regularPrice: 17.95,
          roomServicePrice: 17.95,

          modifiers: [],
        },
        {
          id: '04879270-530f-11ea-b801-7b9e59bfd88b',
          name: 'Pan fried chicken supreme',
          description:
            'With sautéed potatoes, curly kale and a wild mushroom sauce',
          regularPrice: 12.95,
          roomServicePrice: 12.95,

          modifiers: [],
        },
        {
          id: '0ed7a5d0-530f-11ea-b801-7b9e59bfd88b',
          name: 'Slow braised Ox tail pie',
          description:
            'Topped with parsley mash and served with winter roasted vegetables',
          regularPrice: 13.95,
          roomServicePrice: 13.95,

          modifiers: [],
        },
        {
          id: '193b6840-530f-11ea-b801-7b9e59bfd88b',
          name: 'Hand carved roast ham and eggs',
          description:
            'Marmalade glazed ham with two large free range Kent fried eggs & chips',
          regularPrice: 9.5,
          roomServicePrice: 9.5,

          modifiers: [],
        },
        {
          id: '22e6fe40-530f-11ea-b801-7b9e59bfd88b',
          name: 'Smoked Ashmore cheese and bacon burger',
          description:
            'Loaded with smoked sweetcure maple bacon, Kentish smoked Ashmore cheese with sticky BBQ relish, garlic aioli and beer braised onions, served with chips',
          regularPrice: 13.5,
          roomServicePrice: 13.5,

          modifiers: [],
        },
        {
          id: '2eed4d20-530f-11ea-b801-7b9e59bfd88b',
          name: 'The planet burger',
          description:
            'Our soya Oumph! burger in a toasted bun, topped with aubergine pickle, pea shoots, vegan mayonnaise & pickled red onions, served with chips',
          regularPrice: 10.95,
          roomServicePrice: 10.95,

          modifiers: [],
        },
        {
          id: '396bea90-530f-11ea-b801-7b9e59bfd88b',
          name: "Surf 'n' Turf burger",
          description:
            'Filled with sautéed prawns in a spicy shrimp & peanut sauce, maple sweetcure bacon, pickled red onions, spiced tamarind relish and roasted garlic & thyme mayonnaise, served with chips',
          regularPrice: 14.5,
          roomServicePrice: 14.5,

          modifiers: [],
        },
        {
          id: '4258eb80-530f-11ea-b801-7b9e59bfd88b',
          name: 'Seeded panko crumbed chicken burger',
          description:
            'Topped with chicken shawarma, rocket leaves, Cuban mojo and buttermilk ranch sauce, served with chips',
          regularPrice: 12.95,
          roomServicePrice: 12.95,

          modifiers: [],
        },
      ],
    },
    {
      id: '4fbfb4c0-530f-11ea-b801-7b9e59bfd88b',
      name: 'Sides',
      items: [
        {
          id: '53658b40-530f-11ea-b801-7b9e59bfd88b',
          name: 'Loaded chips',
          description:
            'Topped with crispy bacon, chillies, spring onions, crispy onions, Cheddar cheese and mozzarella, drizzled with BBQ sauce and baconnaise',
          regularPrice: 5.5,
          roomServicePrice: 5.5,

          modifiers: [],
        },
        {
          id: '5f0a5930-530f-11ea-b801-7b9e59bfd88b',
          name: 'Beer battered onion rings',
          regularPrice: 3.5,
          roomServicePrice: 3.5,

          modifiers: [],
        },
        {
          id: '6c3bba90-530f-11ea-b801-7b9e59bfd88b',
          name: 'Seasonal vegetables',
          regularPrice: 2.95,
          roomServicePrice: 2.95,

          modifiers: [],
        },
        {
          id: '73479f70-530f-11ea-b801-7b9e59bfd88b',
          name: 'Garden salad',
          regularPrice: 2.95,
          roomServicePrice: 2.95,

          modifiers: [],
        },
        {
          id: '78a9cbf0-530f-11ea-b801-7b9e59bfd88b',
          name: 'Peppercorn sauce',
          regularPrice: 1.5,
          roomServicePrice: 1.5,

          modifiers: [],
        },
      ],
    },
    {
      id: '80162050-530f-11ea-b801-7b9e59bfd88b',
      name: 'Desserts',
      items: [
        {
          id: '8917e1c0-530f-11ea-b801-7b9e59bfd88b',
          name: 'Warm triple chocolate brownie',
          description:
            'Topped with clotted cream ice cream, salted caramel sauce, sliced fresh banana, toasted hazelnuts & shortbread crumb',
          regularPrice: 5.95,
          roomServicePrice: 5.95,

          modifiers: [],
        },
        {
          id: '92fde8b0-530f-11ea-b801-7b9e59bfd88b',
          name: 'Blackcurrant delice',
          description:
            'With raspberry coulis, lemon sorbet and candied walnuts',
          regularPrice: 6.95,
          roomServicePrice: 6.95,

          modifiers: [],
        },
        {
          id: 'a1459c10-530f-11ea-b801-7b9e59bfd88b',
          name: 'Crème brûlée',
          description:
            'Scented with passion fruit, lime and vanilla served with shortbread',
          regularPrice: 6.5,
          roomServicePrice: 6.5,

          modifiers: [],
        },
        {
          id: 'ab5a0600-530f-11ea-b801-7b9e59bfd88b',
          name: 'Warm sticky toffee pudding',
          description: 'Served with crème anglaise',
          regularPrice: 6.5,
          roomServicePrice: 6.5,

          modifiers: [],
        },
        {
          id: 'b5aa4070-530f-11ea-b801-7b9e59bfd88b',
          name: 'Golden baked vanilla cheesecake',
          description: 'With a rich mulled fruit compote & pistachio dust',
          regularPrice: 5.95,
          roomServicePrice: 5.95,

          modifiers: [],
        },
        {
          id: 'be5fddb0-530f-11ea-b801-7b9e59bfd88b',
          name: 'Apple and cherry crumble',
          description: 'Served with a jug of warm custard',
          regularPrice: 6.5,
          roomServicePrice: 6.5,

          modifiers: [],
        },
      ],
    },
  ],
};

pricelist.catalog.labels = [
  {
    name: 'g',
    id: '56396130-530e-11ea-b801-7b9e59bfd88b',
  },
  {
    name: 'vg',
    id: 'bd47eff0-530d-11ea-b801-7b9e59bfd88b',
  },
  {
    name: 'v',
    id: 'bb1f6aa0-530d-11ea-b801-7b9e59bfd88b',
  },
];

pricelist.space = space;
pricelist.hotel = mainHotel;
pricelist.group = mainGroup;

export const pricelists = [pricelist];
