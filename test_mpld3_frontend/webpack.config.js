const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');


base_config = {
  mode: 'development', // For debugging
  entry: './src/index.tsx',
  devtool: 'inline-source-map', // For debugging
  cache: true,
  module: {
    rules: [
      {
        loader: 'ts-loader',
        test: /\.tsx?$/,
        exclude: [
          /node_modules/,
          path.resolve(__dirname, "src/stories")
        ],
        options: {
          configFile: 'tsconfig.json'
        }
      },
      {
        test: /\.css?$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          }
        ]
      },
      {
        test: /\.less?$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(jpg|png)$/,
        use: [
          'url-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      "@node": path.resolve(__dirname, "node_modules"),
      "@components": path.resolve(__dirname, "src"),
      "@bundle": path.resolve(__dirname, "dist"),
    }
  },
  output: {
    filename: 'static/js/bundle.js',
    path: path.resolve(__dirname, 'bundle')
  },
  plugins: [
    new ESLintPlugin({
      emitError: true,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'src', 'index.html'),
      inlineSource: '.(js|css)$',
      minify: true
    }),
  ],
  devServer: {
      contentBase: path.resolve(__dirname, 'bundle'),
      reload: true,
  }
}


module.exports = [
  base_config,
];