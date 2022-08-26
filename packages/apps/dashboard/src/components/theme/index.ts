/* eslint-disable prefer-destructuring */

const device = {
  mobile: 425,
  tablet: 768,
  laptop: 992,
  desktop: 1200,
};

export const theme = {
  colors: {
    blue: '#0784f8',
    ultraLightBlue: '#f6fafd',
    lightBlue: '#ddeffc',
    fadedBlue: '#e8f0fc',
    altBlue: '#4c8add',
    gray: '#f2f2f2',
    lightGray: '#f0f0f0',
    fadedGray: '#fbfbfc',
    lightGreen: '#c8eddb',
    red: '#cd3d64',
    altRed: '#eb5757',
    lightRed: '#ffcece',
    lightOrange: '#feedd3',
    white: '#fff',
    offWhite: '#f4f4f4',
    amber: '#ffbf00',
    orange: '#fca727',
    green: '#1BC182',
  },
  textColors: {
    gray: '#333742',
    lightGray: '#898e96',
    ultraLightGray: '#a8adb4',
    ashGray: '#9b9dae',
    blue: '#0784f8',
    altBlue: '#1a73e8',
    red: '#e75e5e',
    green: '#169e5d',
    orange: '#fca727',
    white: '#fff',
    purple: '#5d6beb',
  },
  space: [4, 8, 16, 24, 32, 40, 64] as Record<string, any>,
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
  fontWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900] as Record<
    string,
    any
  >,
  button: {
    loadingOpacity: 0.3,
  },
  modal: {
    delay: 300,
  },
  layout: {
    page: {
      marginHorizontal: '24px',
    },
  },

  breakpoints: ['425px', '768px', '992px', '1200px'],

  mediaQueries: {} as {
    mobile: string;
    tablet: string;
    laptop: string;
    desktop: string;
    desktopL: string;
    size: typeof device;
  },
};

// aliases

theme.space.tiny = theme.space[0];
theme.space.small = theme.space[1];
theme.space.medium = theme.space[2];
theme.space.large = theme.space[3];
theme.space.huge = theme.space[4];
theme.space.giant = theme.space[5];
theme.space.colossal = theme.space[6];

theme.fontWeights.thin = theme.fontWeights[0];
theme.fontWeights.light = theme.fontWeights[1];
theme.fontWeights.regular = theme.fontWeights[3];
theme.fontWeights.medium = theme.fontWeights[4];
theme.fontWeights.semibold = theme.fontWeights[5];
theme.fontWeights.bold = theme.fontWeights[7];

theme.mediaQueries = {
  mobile: `@media (max-width: ${theme.breakpoints[0]})`,
  tablet: `@media (max-width: ${theme.breakpoints[1]})`,
  laptop: `@media (max-width: ${theme.breakpoints[2]})`,
  desktop: `@media (max-width: ${theme.breakpoints[3]})`,
  desktopL: `@media (max-width: ${theme.breakpoints[3]})`,
  size: device,
};
