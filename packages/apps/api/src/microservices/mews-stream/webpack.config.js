/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const baseConfig = require('../../../webpack-base.config');
const dotenv = require('dotenv');

dotenv.config();

if (process.env.NODE_ENV === 'development') {
  process.env.MONGO_DB_URI = 'mongodb://host.docker.internal:33832';
  process.env.ELASTICSEARCH_URI = 'http://host.docker.internal:33833';
  process.env.REDIS_URI = 'redis://host.docker.internal:33834';
}

module.exports = {
  ...baseConfig,
  entry: './src/microservices/mews-stream/server.ts',
  output: {
    libraryTarget: 'umd',
    filename: 'server.bundle.js',
    path: path.resolve(__dirname, '.webpack'),
  },
};
