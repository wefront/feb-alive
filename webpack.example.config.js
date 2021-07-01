const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  context: path.resolve(__dirname, './'),
  mode: isProd ? 'production' : 'development',
  entry: './example/main.js',
  devtool: '#source-map',
  output: {
    path: path.resolve(__dirname, './demo'),
    publicPath: isProd ? '/feb-alive/' : '/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    progress: false,
    compress: true,
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    hot: true,
    open: true,
    port: 8080
  },
  performance: {
    hints: false
  },
  plugins: [
    new VueLoaderPlugin(),
  ]
}

if (isProd) {
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        BASE_URL: '"/feb-alive/"',
        NODE_ENV: '"production"'
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new HtmlWebpackPlugin({
      hash: true,
      inject: true,
      filename: 'index.html',
      template: 'index.html',
    })
  ])
} else {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
    })
  ])
}
