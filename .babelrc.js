module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: 78,
          node: 12,
          electron: '7.1.11',
        },
      },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
};
