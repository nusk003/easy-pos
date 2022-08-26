/* eslint-disable @typescript-eslint/no-var-requires */
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const dotenv = require('dotenv');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');

dotenv.config();

const optionalModules = new Set([
  ...Object.keys(require('knex/package.json').browser),
  ...Object.keys(require('@mikro-orm/core/package.json').peerDependencies),
  ...Object.keys(require('@mikro-orm/core/package.json').devDependencies || {}),
]);

const lazyImports = [
  '@nestjs/microservices',
  '@nestjs/microservices/microservices-module',
  '@nestjs/websockets/socket-module',
  '@nestjs/platform-express',
  'cache-manager',
  'class-validator',
  'class-transformer',
  'class-transformer/storage',
  'apollo-server-fastify',
  'apollo-server-express',
  '@apollo/subgraph',
  '@apollo/subgraph/dist/directives',
  '@apollo/gateway',
  'fastify-static',
  'point-of-view',
];

module.exports = {
  mode: process.env.NODE_ENV,
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: [/node_modules/],
        use: 'ts-loader',
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: false,
          compress: {
            keep_classnames: true,
            keep_fnames: true,
          },
        },
      }),
    ],
  },
  resolve: {
    extensions: ['.ts', '.mjs', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.build.json' })],
  },
  plugins: [
    new webpack.EnvironmentPlugin(Object.keys(process.env)),
    new webpack.IgnorePlugin({
      checkResource(resource) {
        const baseResource = resource
          .split('/', resource[0] === '@' ? 2 : 1)
          .join('/');

        if (optionalModules.has(baseResource)) {
          try {
            require.resolve(resource);
            return false;
          } catch {
            return true;
          }
        }

        if (!lazyImports.includes(resource)) {
          return false;
        }

        try {
          require.resolve(resource);
          return false;
        } catch (err) {
          return true;
        }
      },
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'src/utils/email/templates/*.hbs',
          to: '.',
        },
      ],
    }),
  ],
  stats: 'errors-only',
};
