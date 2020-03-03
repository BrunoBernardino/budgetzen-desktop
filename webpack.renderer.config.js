const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push(
  {
    test: /\.scss$/,
    use: [
      { loader: 'style-loader' },
      { loader: 'css-loader' },
      { loader: 'sass-loader' },
    ],
  },
  {
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
  },
);

module.exports = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.scss',
      '.css',
      '.json',
      '.png',
    ],
  },
};
