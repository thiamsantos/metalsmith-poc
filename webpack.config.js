const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')

module.exports = {
  entry: {
    site: path.resolve(__dirname, 'src/main.js')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[chunkhash].js'
  },
  plugins: [
    new ExtractTextPlugin('style.[contenthash].css'),
    new WebpackAssetsManifest({
      output: path.resolve(__dirname, 'manifest.json')
    })
  ]
}
