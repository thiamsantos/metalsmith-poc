const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const cssnext = require('postcss-cssnext')
const cssnano = require('cssnano')
const easyImport = require('postcss-easy-import')

module.exports = {
  entry: {
    site: path.resolve(__dirname, 'src/index.js')
  },
  resolve: {aliasFields: ['browser']},
  plugins: [
    new CleanWebpackPlugin(['assets']),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css',
      chunkFilename: '[id].[contenthash].css'
    }),
    new WebpackAssetsManifest()
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'vendor',
          chunks: 'all',
          minChunks: 2
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader'
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              localIdentName: '[local]--[hash:base64]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => {
                return [
                  easyImport(),
                  cssnext({
                    warnForDuplicates: false
                  }),
                  cssnano({
                    discardUnused: {
                      fontFace: false,
                      keyframes: false
                    },
                    zindex: false,
                    reduceIdents: false
                  })
                ]
              }
            }
          }
        ]
      }
    ]
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'assets'),
    publicPath: '/assets/'
  }
}
