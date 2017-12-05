const chalk = require('chalk')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const cssnext = require('postcss-cssnext')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const webpack = require('webpack')
const qrsPackageJSON = require('./package.json')

const dev = process.env.NODE_ENV !== 'production'

const basePath = process.cwd()

// variables that can optionally be overriden by a qrs.config.js
let packageName
let sourcePath

console.log(
  chalk.white.bgGreen(' QRS '),
  chalk.bold('Version:'),
  qrsPackageJSON.version
)
console.log(chalk.white.bgGreen(' QRS '), chalk.bold('Starting...'))

let overrideConfig = () => {}
const overridePath = path.resolve(basePath, 'qrs.config.js')

if (fs.existsSync(overridePath)) {
  console.log(
    chalk.white.bgGreen(' QRS '),
    chalk.bold('Using config overrides...')
  )

  try {
    const data = require(overridePath)
    overrideConfig =
      typeof data.webpack === 'function' ? data.webpack : overrideConfig
    packageName = data.packageName
    sourcePath = data.sourcePath
  } catch (e) {
    console.log('Error: ', e.stack)
  }
}

console.log('')

// set sourcePath to the default basePath if it has not been overriden
if (!sourcePath) sourcePath = basePath

const projectPackageJSON = require(path.resolve(sourcePath, 'package.json'))

const PATHS = {
  index: path.resolve(sourcePath, 'src/index'),
  build: path.resolve(sourcePath, 'dist'),
  styles: path.resolve(sourcePath, 'src/styles')
}

const cssLoaders = modules => [
  'style-loader',
  {
    loader: 'css-loader',
    query: {
      modules,
      localIdentName: dev ? '[name]__[local]___[hash:base64:5]' : undefined,
      minimize: !dev
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [cssnext()]
    }
  },
  'sass-loader'
]

const config = {
  entry: ['@babel/polyfill', PATHS.index],
  output: {
    path: PATHS.build,
    filename: `${packageName || projectPackageJSON.name || 'bundle'}.js`,
    publicPath: ''
  },
  stats: {
    chunks: false,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: true,
    modules: false,
    performance: true,
    timings: true,
    version: true,
    warnings: true
  },
  plugins: [
    new StyleLintPlugin({
      configFile: path.resolve(__dirname, '.stylelintrc.json'),
      context: path.resolve(sourcePath, 'src'),
      files: '**/*.scss',
      emitErrors: false
    }),
    new ExtractTextPlugin({
      filename: `${packageName || projectPackageJSON.name || 'bundle'}.css`,
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(sourcePath, 'src/index.html'),
      hash: true
    }),
    new webpack.BannerPlugin(
      `qrs webpack bundle - version: ${
        projectPackageJSON.version
      } - timestamp: ${new Date().toString()}`
    )
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        use: {
          loader: 'eslint-loader',
          options: {
            configFile: path.resolve(__dirname, '.eslintrc.js'),
            emitWarning: true
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: `babel-loader?${JSON.stringify({
              extends: path.resolve(__dirname, '.babelrc.json')
            })}`
          }
        ],
        exclude: /node_modules/
      },
      {
        // use css module scoping for components
        test: /\.scss$/,
        use: dev
          ? cssLoaders(true)
          : ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: cssLoaders(true).slice(1)
            }),
        exclude: [PATHS.index, PATHS.styles]
      },
      {
        // don't use css module scoping for the app
        test: /\.scss$/,
        use: dev
          ? cssLoaders(false)
          : ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: cssLoaders(false).slice(1)
            }),
        include: [PATHS.index, PATHS.styles]
      },
      {
        test: /\.(png|svg|gif|jpe?g)$/,
        use: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          {
            loader: 'image-webpack-loader',
            query: {
              bypassOnDebug: true,
              gifsicle: {
                interlaced: false
              },
              optipng: {
                optimizationLevel: 7
              }
            }
          }
        ]
      }
    ]
  }
}

if (dev) {
  config.devtool = 'cheap-module-inline-source-map'
  config.entry.unshift(
    'webpack-hot-middleware/client?overlay=false&reload=true'
  )
  config.plugins.push(new webpack.HotModuleReplacementPlugin())

  config.devServer = {
    host: '0.0.0.0',
    port: 3000,
    contentBase: [path.resolve(sourcePath, './assets')],
    compress: true,
    historyApiFallback: true,
    hot: true,
    noInfo: true,
    watchContentBase: true
  }
} else {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: /qrs webpack bundle/,
        ascii_only: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  )
}

module.exports = Object.assign(
  {},
  config,
  overrideConfig(Object.assign({}, config))
)
