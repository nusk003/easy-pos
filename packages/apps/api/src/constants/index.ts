import dotenv from 'dotenv';
import ip from 'ip';

dotenv.config();

export const __node_env__ = process.env.NODE_ENV as string;

export const __port__ = process.env.PORT as string;

export const __stage__ = process.env.STAGE as
  | 'development'
  | 'test'
  | 'staging'
  | 'production';

export const __https__ = process.env.HTTPS === 'true';

export const __dev__ = __stage__ === 'development';

export const __test__ = __stage__ === 'test';

export const __stg__ = __stage__ === 'staging';

export const __prod__ = __stage__ === 'production';

export const __mongodb_db_name__ = 'easy-pos';

export const __redis_uri__ = process.env.REDIS_URI as string;

export const __jwt_secret__ = process.env.JWT_SECRET as string;

export const __jwt_expiry__ = 28 * 24 * 60 * 60;

export const __sg_mail_key__ = process.env.SG_MAIL_KEY as string;

export const __stripe_sk__ = process.env.STRIPE_SK as string;

export const __google_maps_api_key__ = process.env
  .GOOGLE_MAPS_API_KEY as string;

export const __vapid_public_key__ = process.env.VAPID_PUBLIC_KEY as string;

export const __vapid_private_key__ = process.env.VAPID_PRIVATE_KEY as string;

export const __aws_access_key_id__ = process.env.AWS_ACCESS_KEY_ID as string;

export const __aws_secret_access_key__ = process.env
  .AWS_SECRET_ACCESS_KEY as string;

export const __domain__ = 'hotelmanager.co' as const;

export const __subdomain__ = __prod__ ? 'app' : 'stg.app';

export const __ip__ = `${ip.address()}`;

export const __guest_app_web_url__ = __dev__
  ? __https__
    ? 'https://localhost:19006'
    : 'http://localhost:19006'
  : __stg__
  ? `https://stg.guest.${__domain__}`
  : __prod__
  ? `https://guest.${__domain__}`
  : <never>undefined;

export const __cloud_console_url__ = __dev__
  ? __https__
    ? 'https://localhost:3000'
    : 'http://localhost:3000'
  : __stg__
  ? `https://stg.app.${__domain__}`
  : __prod__
  ? `https://app.${__domain__}`
  : <never>undefined;

export const __api_url__ = __dev__
  ? process.env.API_URL
  : __stg__
  ? `https://stg.api.${__domain__}`
  : __prod__
  ? `https://api.${__domain__}`
  : <never>undefined;

export const __mongodb_uri__ = __dev__
  ? <string>process.env.MONGO_DB_URI
  : __stg__
  ? <string>process.env.STG_MONGO_DB_URI || <string>process.env.MONGO_DB_URI
  : __prod__
  ? <string>process.env.MONGO_DB_URI
  : <never>undefined;

export const __elasticsearch_uri__ = __dev__
  ? <string>process.env.ELASTICSEARCH_URI
  : __stg__
  ? <string>process.env.STG_ELASTICSEARCH_URI ||
    <string>process.env.ELASTICSEARCH_URI
  : __prod__
  ? <string>process.env.ELASTICSEARCH_URI
  : <never>undefined;

export const __hm_group_id__ = __prod__
  ? '5e74a9a274d01e32d081ca8a'
  : '5f7cae1cc806905c47eb9066';

export const __demo_group_id__ = '5ed0b6642bed864b31f0035c';

export const __ws_prod_endpoint__ =
  'https://l84cot1k5k.execute-api.eu-west-2.amazonaws.com/production';

export const __ws_stg_endpoint__ =
  'https://2mmo3ebone.execute-api.eu-west-2.amazonaws.com/staging';

export const __ws_dev_endpoint__ = 'http://localhost:5001';

export const __ws_endpoint__ = __dev__
  ? __ws_dev_endpoint__
  : __stg__
  ? __ws_stg_endpoint__
  : __prod__
  ? __ws_prod_endpoint__
  : <never>undefined;

export const __sls_offline__ = !!process.env.IS_OFFLINE;

export const __whs_offline__ = !!process.env.WHS_OFFLINE;

export const __aws_account_id__ = process.env.AWS_ACCOUNT_ID as string;

export const __apaleo_client_id__ = __prod__
  ? 'NQDK-AC-HOTEL_MANAGER'
  : 'NQDK-AC-HM_STAGING';

export const __apaleo_client_secret__ = process.env.APALEO_CLIENT_SECRET;

export const __apaleo_identify_api_endpoint__ = 'https://identity.apaleo.com';

export const __apaleo_webhook_api_endpoint__ = 'https://webhook.apaleo.com';

export const __apaleo_api_endpoint__ = 'https://api.apaleo.com';

export const __mews_platform_address__ = __prod__
  ? 'https://api.mews.com'
  : 'https://api.mews-demo.com';

export const __mews_websocket_address__ = __prod__
  ? 'wss://ws.mews.com'
  : 'wss://ws.mews-demo.com';

export const __omnivore_api_base_url__ = 'https://api.omnivore.io';

export const __mews_stream_address__ = __dev__
  ? 'http://localhost:8000'
  : __stg__
  ? 'https://wwimv8exdm.eu-west-1.awsapprunner.com'
  : __prod__
  ? 'https://pbpnf5tbtk.eu-west-1.awsapprunner.com'
  : <never>undefined;

export const __fly_api_endpoint__ = 'https://api.fly.io/graphql';

export const __fly_api_key__ = <string>process.env.FLY_API_KEY;

export const __fly_api_app_id__ = __prod__
  ? 'guest-app-production'
  : 'guest-app-staging';
