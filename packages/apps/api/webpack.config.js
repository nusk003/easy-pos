/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const baseConfig = require('./webpack-base.config');
const dotenv = require('dotenv');

dotenv.config();

if (process.env.NODE_ENV === 'development') {
  process.env.MONGO_DB_URI = 'mongodb://host.docker.internal:33832';
  process.env.ELASTICSEARCH_URI = 'http://host.docker.internal:33833';
  process.env.REDIS_URI = 'redis://host.docker.internal:33834';
}

module.exports = {
  ...baseConfig,
  entry: './src/server.ts',
  output: {
    path: path.resolve(__dirname, '.webpack'),
    filename: 'server.bundle.js',
  },
};
