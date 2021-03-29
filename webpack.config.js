const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'purcotton-ui.js',
    publicPath: '/',
    library: 'PurcottonUi',
    libraryTarget: 'umd'
  },
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 1000
  },
  module: {
    rules: [{
      test: /\.vue$/,
      use: ['vue-loader']
    },
    {
      test: /\.js$/,
      use: ['babel-loader'],
      exclude: /node_modules/
    },
    {
      test: /\.(sa|sc|c)ss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      exclude: /node_modules/,
      include: path.resolve(__dirname, 'src')
    },
    {
      test: /\.(gif|jpg|png|bmp|eot|woff|woff2|ttf|svg)/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 1024,
          outputPath: 'images'
        }
      }]
    }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
    // 使用的扩展名

    alias: {
      'vue$': 'vue/dist/vue.esm-browser.js',
      '@': path.resolve(__dirname, 'src')
    }
  },
  externals: ['element-plus'],
  devtool: 'source-map',
  plugins: [
    new VueLoaderPlugin()
  ]
}
