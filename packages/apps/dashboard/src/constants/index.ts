// eslint-disable-next-line no-restricted-imports
import packageJSON from '../../package.json';

export const __stage__ = process.env.REACT_APP_STAGE as
  | 'development'
  | 'staging'
  | 'production';
export const __dev__ = __stage__ === 'development';
export const https = process.env.REACT_APP_HTTPS === 'true';

let graphqlEndpoint: string;
let lydBase: string;
let rootAddress: string;

if (__stage__ === 'development') {
  graphqlEndpoint = https
    ? 'https://localhost:5000/graphql'
    : 'http://localhost:5000/graphql';
  lydBase = 'ws://localhost:5001';
  rootAddress = https ? 'https://localhost:3000' : 'http://localhost:3000';
} else if (__stage__ === 'staging') {
  graphqlEndpoint = 'https://stg.api.hotelmanager.co/graphql';
  lydBase = 'wss://stg.lyd.hotelmanager.co';
  rootAddress = 'https://stg.app.hotelmanager.co';
} else if (__stage__ === 'production') {
  graphqlEndpoint = 'https://api.hotelmanager.co/graphql';
  lydBase = 'wss://lyd.hotelmanager.co';
  rootAddress = 'https://app.hotelmanager.co';
}

export const __version__ = packageJSON.version;
export const __graphql_endpoint__ = graphqlEndpoint!;
export const __lyd_base__ = lydBase!;
export const __root_address__ = rootAddress!;

export const __stripe_client_id__ =
  __stage__ === 'production'
    ? 'ca_HktheVVcLg25pAGyI97caWRgQAVxymrR'
    : 'ca_Hkthymnigv6jjdwSlEHnEAII6qg3LcY2';

export const __mews_test_client_token__ =
  '07AB1F14B55C49B8BDD6AD200158423B-273A4497AFF5E20566D7199DB3DC2BA';
export const __mews_test_access_token__ =
  'BFD4298010F54B069F3DAD20015D53EA-D5561FADFBA4EFC8EA4C179C6BC461F';

export const __omnivore_test_api_key__ = 'ae0f5b97a3074fbca13f7802cb14443d';

const apaleoClientId =
  __stage__ === 'production' ? 'NQDK-AC-HOTEL_MANAGER' : 'NQDK-AC-HM_STAGING';
export const __apaleo_authorize_link__ = `https://identity.apaleo.com/connect/authorize?response_type=code&scope=offline_access openid availability.read rates.read reservations.read reservations.manage folios.read folios.manage identity:account-users.read&client_id=${apaleoClientId}&redirect_uri=${__root_address__}/manage/marketplace/apaleo`;

export const __electron__ = /electron/i.test(navigator.userAgent);

export const __os__ = (['Windows', 'Linux', 'Mac'] as const).find((v) =>
  navigator.appVersion.includes(v)
)!;

export const __macos__ = __os__ === 'Mac';

export const __windows__ = __os__ === 'Windows';

export const __linux__ = __os__ === 'Linux';
