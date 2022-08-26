const path = require('path');
const CracoAlias = require('craco-alias');

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: '.',
        tsConfigPath: './tsconfig.paths.json',
      },
    },
  ],
  babel: {
    env: {
      development: {
        plugins: ['babel-plugin-styled-components'],
      },
    },
    plugins: ['@babel/plugin-proposal-optional-chaining', 'lodash'],
  },
};
