const { merge } = require('webpack-merge');

const commonConfig = require('./webpack.client.common');

module.exports = merge(commonConfig, {
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    hints: false,
  },
});
