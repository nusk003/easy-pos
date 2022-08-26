const path = require('path');
const stripDecorators = path.resolve('./strip-decorators.js');

module.exports = {
  entry: './index.ts',
  mode: 'production',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        use: 'ts-loader',
      },
      {
        test: /\.tsx?$/,
        include: [path.resolve(__dirname, '../../apps/api')],
        use: [
          'strip-decorators',
          {
            loader: stripDecorators,
          },
        ],
      },
    ],
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname)],
  },
  externals: {
    graphql: 'graphql',
    tslib: 'tslib',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    libraryTarget: 'umd',
    filename: 'index.js',
    path: path.resolve(__dirname, 'lib'),
  },
  stats: 'errors-only',
};
