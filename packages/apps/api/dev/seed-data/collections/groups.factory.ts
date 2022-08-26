import { __hm_group_id__, __main_group_id__ } from '@dev/seed-data/constants';
import { Group } from '@src/modules/group/entities';

export const hmGroup = new Group();
hmGroup._id = __hm_group_id__;
hmGroup.name = 'Hotel Manager';
hmGroup.hotelManager = true;

export const mainGroup = new Group();
mainGroup._id = __main_group_id__;
mainGroup.name = 'Elah One';
mainGroup.app = {
  versionCode: 15,
  metadata: {
    title: 'Elah One',
    subtitle: 'Re-imagined guest experience.',
    shortDescription:
      'Instantly browse the hotel and order room service straight from the app.',
    fullDescription:
      'Hospitality just got an upgrade.\n\nA full-stack guest experience solution that taps into the possibilities of everyone’s most-loved device. Deployed and backed by a powerful cloud-based console for hoteliers.\nA beautifully integrated ecosystem where hotels are at the epicentre.\n\nDownload our guest app experience.\n\nThe platform is available for hotels.',
    keywords:
      'Hotel, Travel, Room, Service, Guest, Experience, Hospitality, Manager, Concierge, Itinerary',
    icon: 'https://i.ibb.co/R2fwW6q/icon.png',
    screenshots: {
      ios: {
        _1: 'https://hm-hotel-assets.s3.eu-west-2.amazonaws.com/stg/5e7a267c757ab344eec9fc69/buildAssets/iosScreenshot1-1594324946.png',
        _2: 'https://hm-hotel-assets.s3.eu-west-2.amazonaws.com/stg/5e7a267c757ab344eec9fc69/buildAssets/iosScreenshot2-1594324947.png',
        _3: 'https://hm-hotel-assets.s3.eu-west-2.amazonaws.com/stg/5e7a267c757ab344eec9fc69/buildAssets/iosScreenshot3-1594324948.png',
      },
      ios55: {
        _1: 'https://hm-hotel-assets.s3.eu-west-2.amazonaws.com/stg/5e7a267c757ab344eec9fc69/buildAssets/ios47Screenshot1-1594324941.png',
        _2: 'https://hm-hotel-assets.s3.eu-west-2.amazonaws.com/stg/5e7a267c757ab344eec9fc69/buildAssets/ios47Screenshot2-1594324942.png',
        _3: 'https://hm-hotel-assets.s3.eu-west-2.amazonaws.com/stg/5e7a267c757ab344eec9fc69/buildAssets/ios47Screenshot3-1594324944.png',
      },
      android: {
        _1: 'https://hm-hotel-assets.s3.eu-west-2.amazonaws.com/stg/5e7a267c757ab344eec9fc69/buildAssets/androidScreenshot1-1594324933.png',
        _2: 'https://hm-hotel-assets.s3.eu-west-2.amazonaws.com/stg/5e7a267c757ab344eec9fc69/buildAssets/androidScreenshot2-1594324935.png',
        _3: 'https://hm-hotel-assets.s3.eu-west-2.amazonaws.com/stg/5e7a267c757ab344eec9fc69/buildAssets/androidScreenshot3-1594324938.png',
        featureGraphic:
          'https://hm-hotel-assets.s3.eu-west-2.amazonaws.com/stg/5e7a267c757ab344eec9fc69/buildAssets/androidFeatureGraphic-1594324932.png',
      },
    },
    ios: {
      appStoreId: '1523203895',
    },
  },
  assets: {
    featuredLogo: 'https://i.ibb.co/ZXYQ064/Header-Logo-Light.png',
    featuredImage: 'https://i.ibb.co/MSMJg9w/featured-Image-1622110848.jpg',
  },
};

export const groups = [hmGroup, mainGroup];
