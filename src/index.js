// 两种引入css的方式:
// import style from './index.css'
require('./index.css')
require('./index.scss')

/* eslint-disable */
// import $ from 'expose-loader?$!jquery' // 内联loader，可读性不好，建议配置在webpack中
import $ from 'jquery'
/* eslint-disable */
// console.log(window.$)
console.log(window.$) // CDN

import green from '../static/img/green.jpg' // 这里也可以用 require 语法
const image = new Image()
image.src = green
document.body.appendChild(image)

import moment from 'moment'
import 'moment/locale/zh-cn' // 在 webpack 中禁止引入所有的语言包，然后再单独引入中文包

import './common'

moment.locale('zh-cn')
console.log(moment().endOf('day').fromNow())


const str = require('./demo.js') // 因为 babel 会把 es2015 模块转换成符合 commonjs 规范的模块，所以可以混用两者的模块语法

console.log(str)

@log
class Person {
  constructor(name) {
    this.name = name
  }
}

function log(target) {
  console.log(target)
}

const foo = new Person('张三')

console.log(foo.name)

const xhr = new XMLHttpRequest()

// xhr.open('get', '/api/user') // dev-server proxy
xhr.open('get', '/user') // webpack-dev-middleware

xhr.send()

// const xhrMock = new XMLHttpRequest()

// xhrMock.open('get', '/mock')

// xhrMock.send()

console.log(process.env)
