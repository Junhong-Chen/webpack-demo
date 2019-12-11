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


const str = require('./demo.js')

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
