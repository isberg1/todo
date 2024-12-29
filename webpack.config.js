const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: './src/code/main.tsx',
  },
  // devtool: "inline-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, './docs'),
    },
    compress: true,
    historyApiFallback: true,
    https: false,
    open: true,
    hot: true,
    port: 9002,
    proxy: {
      '/api': 'http://localhost:9000',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Main',
      filename: 'index.html',
      chunks: ['main'],
      scriptLoading: 'module',
      favicon: 'src/favicon.ico',
    }),
    new CopyPlugin({
      patterns: [
        {
          context: path.resolve(__dirname, 'src'), from: '*.json', to: '.',
        },
      ],
    }),
    new CopyPlugin({
      patterns: [
        {
          context: path.resolve(__dirname, 'src'), from: '*.js', to: '.',
        },
      ],
    }),
    new CopyPlugin({
      patterns: [
        {
          context: path.resolve(__dirname, 'src/images'), from: '*', to: './images',
        },
      ],
    }),
    new CopyPlugin({
      patterns: [
        {
          context: path.resolve(__dirname, 'src/css'), from: '*', to: './css',
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'docs'),
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(ts|tsx)?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(csv|tsv)$/i,
        use: ['csv-loader'],
      },
      {
        test: /\.xml$/i,
        use: ['xml-loader'],
      },
    ],
  },
};
