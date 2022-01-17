const path = require('path');

const webpack = require('webpack');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const getPath = (...p) => path.resolve(process.cwd(), ...p);

dotenv.config();

const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';
const CLIENT_TITLE = process.env.CLIENT_TITLE || 'App';

const HtmlWebpackPluginWithConfig = new HtmlWebpackPlugin({
  template: getPath('webpack', 'html-template.ejs'),
  filename: 'index.html',
  inject: true,
  templateParameters: {
    publicPath: PUBLIC_PATH,
    appTitle: CLIENT_TITLE,
  },
});

const DefinePluginWithConfig = new webpack.DefinePlugin({
  'process.env': JSON.stringify(process.env),
});

const CopyWebpackPluginWithConfig = new CopyWebpackPlugin({
  patterns: [{ from: getPath('public') }],
});

module.exports = {
  entry: getPath('src', 'client', 'index.tsx'),
  output: {
    filename: '[name].[fullhash].js',
    path: getPath('dist', 'client'),
    publicPath: PUBLIC_PATH,
    chunkFilename: '[chunkhash].chunk.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      client: getPath('src', 'client'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(m?js|jsx|tsx|ts)$/,
        include: getPath('src', 'client'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    HtmlWebpackPluginWithConfig,
    DefinePluginWithConfig,
    CopyWebpackPluginWithConfig,
    new CleanWebpackPlugin(),
  ],
};
