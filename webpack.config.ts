import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';

const DIST = {
  dist: 'dist',
  js: path.join('assets', 'js'),
  css: path.join('assets', 'css'),
  fonts: path.join('assets', 'fonts'),
  img: path.join('assets', 'img'),
};

const webpackConfig: webpack.Configuration = {
  devtool: 'cheap-module-eval-source-map',

  entry: {
    app: './app/app.module.ng.ts',
    main: './app/main.ts',
  },

  output: {
    filename: `${DIST.js}/[name].js`,
    path: path.join(__dirname, DIST.dist),
    publicPath: '',
  },

  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@angular/upgrade/static': '@angular/upgrade/bundles/upgrade-static.umd.js',
    },
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: 'tsconfig.json' },
          },
          'angular2-template-loader',
        ],
      },
      {
        test: /\.css$/,
        exclude: path.join(__dirname, './app'),
        use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?sourceMap' }),
      },
      {
        test: /\.s[ac]ss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' },
            { loader: 'sass-loader' },
          ],
        }),
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: `file-loader?name=${DIST.img}/[name].[hash].[ext]`,
      },
      {
        test: /\.(woff|woff2|ttf|eot|ico)$/,
        use: `file-loader?name=${DIST.fonts}/[name].[hash].[ext]`,
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin([path.join(__dirname, DIST.dist)]),
    new HtmlWebpackPlugin({ template: './app/index.html' }),
    new webpack.ContextReplacementPlugin(
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, './app'),
      {},
    ),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['main', 'app'],
    }),
    new ExtractTextPlugin(`${DIST.css}/[name].css`),
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal',
  },
};

export default webpackConfig;
