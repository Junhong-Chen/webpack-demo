const merge = require('webpack-merge')
const baseConfig = require('./webpack.config')
const webpack = require('webpack')

module.exports = merge(baseConfig, {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify('dev')
    })
  ]
})
