import { IntegrationProvider, IntegrationType } from '@hm/sdk';
import { theme } from '@src/components/theme';
import { __stage__ } from '@src/constants';

export type ManageMarketplaceIntegrationItemModel = {
  slug: string;
  available: boolean;
  provider: IntegrationProvider | string;
  description: string;
  type: IntegrationType;
  logo: string;
  logoBackgroundColor?: string;
  websiteURL: string;
  documentationURL?: string;
  helpURL?: string;
};

export const integrationData: ManageMarketplaceIntegrationItemModel[] = [
  {
    slug: '/apaleo',
    available: true,
    provider: IntegrationProvider.Apaleo,
    description:
      "All types of properties - from serviced apartments to hotel chains - rely on apaleo's APIs and community to create digital experiences for their guests and staff. Instantly connect the leading hospitality apps to the apaleo interface or use open APIs for unlimited customization possibilities.",
    logo: 'https://apaleo.dev/assets/images/apaleo_logo.png',
    logoBackgroundColor: theme.textColors.gray,
    type: IntegrationType.Pms,
    websiteURL: 'https://www.apaleo.com/',
    documentationURL: 'https://www.apaleo.com/apaleo-pms/',
    helpURL: 'https://www.apaleo.com/apaleo-pms/',
  },
  {
    slug: '/mews',
    available: true,
    provider: IntegrationProvider.Mews,
    description:
      'Mews is designed to simplify and automate all operations for modern hoteliers and their guests. From the booking engine to check-out, from front desk to revenue management, every process is easier, faster and more connected. And with the integrated Mews Payments ecosystem, every transaction is secure and seamless.',
    logo: 'https://www.mews.com/hubfs/_Project_Phoenix/images/logo/Mews%20Logo.svg',
    type: IntegrationType.Pms,
    websiteURL: 'https://www.mews.com/',
  },
  {
    slug: '/agilysys',
    available: false,
    provider: IntegrationProvider.Agilysys,
    description:
      'An intuitive, cloud-based property management system (PMS) for resorts and hotels. Keep business flowing effortlessly, on any operating system. From an individual location to an enterprise chain, get the most modern, comprehensive property management solutions for managing your hospitality business.',
    logo: 'https://mms.businesswire.com/media/20200128005780/en/769970/23/Agilysys_logo_green_2013.jpg',
    type: IntegrationType.Pms,
    websiteURL: 'https://www.agilysys.com/',
  },
  {
    slug: '/opera',
    available: false,
    provider: IntegrationProvider.Opera,
    description:
      'Equip your hotel with property management and point-of-sale (POS) systems that empower staff to perform at their best. Oracle cloud-based property-management systems (PMS) and hotel POS solutions give you new ways to innovate by easily integrating other technologies—creating moments that guests will never forget.',
    logo: 'http://www.hospitalitytechhub.com/wp-content/uploads/2021/04/Oracle.png',
    type: IntegrationType.Pms,
    websiteURL:
      'https://www.oracle.com/industries/hospitality/hotel-property-management/',
  },
  {
    slug: '/protel',
    available: false,
    provider: IntegrationProvider.Protel,
    description:
      'Protel’s cloud-based PMS helps hotels boost guest-experience. Less time on the keyboard equals more time for the guest. Simple! Seamless communication between departments? Check. Billing and invoicing functions to help keep track of every transaction?',
    logo: 'https://protel.net/wp-content/uploads/2019/06/protel_logo_rgb-WEB.png',
    type: IntegrationType.Pms,
    websiteURL: 'https://www.protel.net/',
  },
  {
    slug: '/room-key-pms',
    available: false,
    provider: IntegrationProvider.RoomKeyPms,
    description:
      'An integrated hotel management platform for a touch-less world. Deliver better guest experiences, increase revenue, and reduce costs with one property management system supported by a North American team of experts.',
    logo: 'https://2l1hy81mcugy3a2daw1snova-wpengine.netdna-ssl.com/wp-content/uploads/2019/08/RoomkeyLogo.svg',
    type: IntegrationType.Pms,
    websiteURL: 'https://roomkeypms.com/',
  },
  {
    slug: '/guestline',
    available: false,
    provider: IntegrationProvider.Guestline,
    description:
      'Our intelligent property management solutions cover all aspects of running a hospitality business, from managing bookings and payments to streamlining the organisation of events.',
    logo: 'https://www.guestline.com/wp-content/uploads/2019/02/logo.png',
    type: IntegrationType.Pms,
    websiteURL: 'https://www.guestline.com/',
  },
  {
    slug: '/rms',
    available: false,
    provider: IntegrationProvider.Rms,
    description:
      'Easily manage your front and back of house operations and customise the flexible Dashboard to suit your property. Our advanced dashboards and interactive chart widgets allows you to dive deeper into your PMS to make data driven business decisions.',
    logo: 'https://www.rmscloud.com/themes/default/images/logo.png',
    type: IntegrationType.Pms,
    websiteURL: 'https://www.rmscloud.com/',
  },
  {
    slug: '/clock-pms',
    available: false,
    provider: IntegrationProvider.ClockPms,
    description:
      'Clock Software offers a complete and integrated suite of cloud-based hotel management software, distribution systems and guest engagement apps, with Clock PMS+ at the forefront.',
    logo: 'https://www.hotelspeak.com/wp-content/sabai/File/files/8b433dc8430b78bfdbf196a4e5b0ec23.png',
    type: IntegrationType.Pms,
    websiteURL: 'https://www.clocksoftware.co.uk/',
  },
  {
    slug: '/webrezpro',
    available: false,
    provider: IntegrationProvider.WebRezPro,
    description:
      'WebRezPro is an all-in-one property management system (Cloud PMS) built for properties of all types and sizes. Designed to streamline lodging operations and maximize direct bookings, it has never been easier to move to the cloud with the world’s best-reviewed hospitality management software.',
    logo: 'https://assets.website-files.com/5f2918148c65b5c6569afb4f/5fc4d8be377fbe2044cc4a5e_Integration_PMS_Webrezpro.jpg',
    type: IntegrationType.Pms,
    websiteURL: 'https://webrezpro.com/',
  },
  ...(__stage__ !== 'production'
    ? [
        {
          slug: '/omnivore-virtual-pos',
          logoBackgroundColor: theme.textColors.gray,
          available: true,
          provider: IntegrationProvider.OmnivoreVirtualPos,
          description:
            'Tired of managing POS upgrades, servers, or antivirus software? Ready to move on from your on-premises POS system? Upgrade to Simphony Point of Sale from Oracle and your restaurant POS system will automatically update and secure itself in the Oracle Cloud.',
          logo: 'data:image/png;base64,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',
          type: IntegrationType.Pos,
          websiteURL:
            'https://www.oracle.com/uk/industries/food-beverage/restaurant-pos-systems/res-3700/',
        },
      ]
    : []),
  {
    slug: '/micros3700',
    available: true,
    provider: IntegrationProvider.Micros3700,
    description:
      'Tired of managing POS upgrades, servers, or antivirus software? Ready to move on from your on-premises POS system? Upgrade to Simphony Point of Sale from Oracle and your restaurant POS system will automatically update and secure itself in the Oracle Cloud.',
    logo: 'https://cdn.softwarereviews.com/production/logos/offerings/4727/large/unnamed_%2835%29.png?1620242919',
    type: IntegrationType.Pos,
    websiteURL:
      'https://www.oracle.com/uk/industries/food-beverage/restaurant-pos-systems/res-3700/',
  },
  {
    slug: '/micros-simphony',
    available: true,
    provider: IntegrationProvider.MicrosSimphony,
    description:
      'The Simphony POS system from Oracle is built for complete restaurant management. Simphony powers the most successful food and beverage venues across the globe, from local cafés and iconic fine dining restaurants to global quick-service chains, stadiums, and theme parks. As an all-in-one cloud POS platform, it helps restaurateurs optimize their online and in-house operations in real time from any device.',
    logo: 'https://res.cloudinary.com/apideck/image/upload/v1573172259/catalog/oracle-micros-simphony/icon128x128.png',
    type: IntegrationType.Pos,
    websiteURL:
      'https://www.oracle.com/uk/industries/food-beverage/restaurant-pos-systems/simphony-pos/',
  },
  {
    slug: '/micros-simphony-first-edition',
    available: true,
    provider: IntegrationProvider.MicrosSimphonyFirstEdition,
    description:
      'The Simphony POS system from Oracle is built for complete restaurant management. Simphony powers the most successful food and beverage venues across the globe, from local cafés and iconic fine dining restaurants to global quick-service chains, stadiums, and theme parks. As an all-in-one cloud POS platform, it helps restaurateurs optimize their online and in-house operations in real time from any device.',
    logo: 'https://res.cloudinary.com/apideck/image/upload/v1573172259/catalog/oracle-micros-simphony/icon128x128.png',
    type: IntegrationType.Pos,
    websiteURL:
      'https://www.oracle.com/uk/industries/food-beverage/restaurant-pos-systems/simphony-pos/',
  },
  {
    slug: '/ncr-aloha',
    available: true,
    provider: IntegrationProvider.NcrAloha,
    description:
      'Get an end-to-end view of your restaurant operation with the Aloha EPOS system – even if you’re in multiple locations.This advanced EPOS system streamlines your whole business, from seating plans to tableside ordering and payment via handheld devices.',
    logo: 'https://images.squarespace-cdn.com/content/v1/59721ec303596e20d63f3719/1501773356398-H9A8TD1HU4LN584ZHOB2/Aloha-Logopng.png',
    type: IntegrationType.Pos,
    websiteURL: 'https://alohaepos.co.uk',
  },
  {
    slug: '/squirrel',
    available: true,
    provider: IntegrationProvider.Squirrel,
    description:
      'Squirrel 11 powers some of the largest and most sophisticated hospitality businesses around. The new Squirrel Cloud is the best of Squirrel distilled to a solution for smaller operations.',
    logo: 'https://allvectorlogo.com/img/2019/03/squirrel-systems-logo.png',
    type: IntegrationType.Pos,
    websiteURL: 'https://www.squirrelsystems.com/',
  },
  {
    slug: '/dinerware',
    available: true,
    provider: IntegrationProvider.Dinerware,
    description:
      'Dinerware delivers a robust and reliable restaurant point of sale software package that is highly flexible, easy to learn, use and modify. Features like fully customizable menus, easy order entry and ticket handling, integrated credit and gift cards, kitchen printing and powerful pricing fuctionality will help you maximize profits, efficiency and productivity throughout your operation.',
    logo: 'https://clearsolutionsip.com/wp-content/uploads/2017/12/Dinerware-Logo.png',
    type: IntegrationType.Pos,
    websiteURL: 'https://dcrpos.com/dinerware/',
  },
  {
    slug: '/focuspos',
    available: true,
    provider: IntegrationProvider.FocusPos,
    description:
      'For nearly 30 years, Focus POS Systems has provided restaurant point of sale software that helps businesses run successfully. Since 1990, we have aimed to give restaurants a competitive edge by providing simple, yet powerful restaurant management solutions, designed specifically for the industry. With Focus POS, you won’t have features you never use—and you will have all the features your restaurant needs. Our reliable products combined with our tried-and-true methodology deliver business value with efficient operations, increased productivity, and greater profitability.',
    logo: 'https://www.focuspos.com/wp-content/uploads/2020/01/focus-only-logo_dpi.png',
    type: IntegrationType.Pos,
    websiteURL: 'https://www.focuspos.com/',
  },
  {
    slug: '/maitre-d',
    available: true,
    provider: IntegrationProvider.MaitreD,
    logoBackgroundColor: '#f7f7f7',
    description:
      "MaitreD POS provides all the functionality restaurant owners need to handle every part of their business operation, regardless of their size. Integrated with PayFacto's payment processing solutions, you can handle credit and debit card payments quickly and securely. Whether you run a fine dining table service restaurant, a quick service restaurant, a bar or nightclub, a hotel or a full event venue, Maitre'D POS does it all.",
    logo: 'https://www.kindpng.com/picc/m/463-4637264_maitre-d-pos-logo-hd-png-download.png',
    type: IntegrationType.Pos,
    websiteURL: 'https://pos.payfacto.com/maitred-pos',
  },
  {
    slug: '/positouch',
    available: true,
    provider: IntegrationProvider.PosItouch,
    description:
      'POSitouch offers a premium software suite with the features and functionality to support restaurants of all sizes, from independent locations to the biggest national chains. Whether you need one terminal or fifty, POSitouch has the solution to fit your business. With leading-edge technology, unparalleled support and training, and the ability to customize a solution to exactly fit your needs, it’s no wonder why POSitouch has been awarded the industry’s highest recognitions and consistently maintains excellent client satisfaction ratings.',
    logo: 'https://www.positouch.com/wp-content/uploads/2019/05/positouch-pos-logo-1.png',
    type: IntegrationType.Pos,
    websiteURL: 'https://www.positouch.com/',
  },
  {
    slug: '/xpient',
    available: true,
    provider: IntegrationProvider.Xpient,
    description:
      'XPIENT is a restaurant Point of Sale system that was acquired by Heartland in 2014. Xpient also provides a complete back office package with Inventory, Food Cost, Labor Scheduling and Cash Management.',
    logo: 'https://www.mirus.com/hs-fs/hubfs/xpient%20logo.png?width=800&name=xpient%20logo.png',
    type: IntegrationType.Pos,
    websiteURL: 'https://www.mirus.com/xpient-restaurant-solutions',
  },
];
