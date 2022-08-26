module.exports = function babel(api) {
  api.cache(true);
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current',
          },
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.js', '.ts'],
          root: ['.'],
          alias: {
            '@src': './src',
            '@constants': './src/constants',
            '@config': './src/config',
            '@libs': './src/libs',
            '@dev': './dev',
            '@tests': './tests',
          },
        },
      ],
      ['babel-plugin-transform-typescript-metadata'],
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true,
        },
      ],
      ['@babel/plugin-proposal-class-properties'],
    ],
  };
};
