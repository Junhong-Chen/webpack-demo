const express = require('express')
const app = express()
const webpack = require('webpack')
const middle = require('webpack-dev-middleware')
const complier = webpack(require('./webpack.config.js'))

app.use(middle(complier))

app.listen(3000)

app.get('/user', (require, response) => {
  response.json({ name: 'Junhong' })
})