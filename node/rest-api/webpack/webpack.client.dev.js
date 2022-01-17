const { merge } = require('webpack-merge');

const commonConfig = require('./webpack.client.common');

module.exports = merge(commonConfig, {
  mode: 'development',
  devServer: {
    host: 'localhost',
    port: process.env.CLIENT_PORT || 4000,
    hot: true,
    open: true,
    compress: true,
    historyApiFallback: true,
    proxy: {
      '/api': process.env.CLIENT_PROXY || 'http:localhost:3000',
    },
  },
  stats: 'errors-warnings',
  devtool: 'eval-cheap-module-source-map',
});
