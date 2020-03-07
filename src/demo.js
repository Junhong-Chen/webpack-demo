export default ['demo']
// module.exports = 'demo'
// 用 module.exports 时会报错，因为 module.exports 指向了一块内存地址，而 require 会从这块地址中拿数据。
// 如果把 module.exports 指向的地址中的内容改变了，而这个文件中还有其他的代码，require 就不知道要导出的是 module.exports 指向的内容还是下面写的代码

import './common'

function* listColors() {
  yield 'red'
  yield 'yellow'
  yield 'blue '
  yield 'green'
}
const colors = listColors()
console.log(colors.next())
// console.lo('source-map') 测试代码报错位置