// 两种引入css的方式:
// import style from './index.css'
require('./index.css')
require('./index.scss')

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
