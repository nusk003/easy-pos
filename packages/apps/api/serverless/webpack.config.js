/* eslint-disable @typescript-eslint/no-var-requires */

const slsw = require('serverless-webpack');
const baseConfig = require('../webpack-base.config');

module.exports = {
  ...baseConfig,
  entry: slsw.lib.entries,
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
};
