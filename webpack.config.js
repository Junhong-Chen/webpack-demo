// webpack 是 node 写出来的，它要使用 node 的写法
const path = require('path') // 引入path模块
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development', // 打包模式，默认为production
  entry: './src/index.js', //入口
  output: { // 出口
    filename: 'bundle.js', // 打包后的文件名。可添加hash戳，命名为: bundle.[hash].js；也可限制hash戳的长度，比如8位: bundle.[hash:8].js
    path: path.resolve(__dirname, 'dist') // 打包后的文件路径，必须填写绝对路径，所以需要用到内置的path模块将相对路径解析成绝对路径。__dirname 为当前文件的绝对路径，也可以不填。
  },
  plugins: [ // 插件
    new HtmlWebpackPlugin({ // 生成一个开发服务用的入口文件
      template: './src/index.html', // 生成入口文件所需要参考的模板
      filename: 'index.html', // 入口文件的文件名，可不填
      hash: true, // 添加hash戳，避免用户依然加缓存中的旧文件
      minify: { // 打包压缩配置项
        removeAttributeQuotes: true, // 删除属性的双引号
        collapseWhitespace: true // 折叠空行
      }
    })
  ],
  devServer: { // 开发服务器
    contentBase: './dist', // 静态服务的目录地址，正常来说目录下可能没有index.html文件，所以需要借助 HtmlWebpackPlugin 来生成一个入口文件，配置了这个插件后可以不填写这个字段
    port: 3000, // 端口
    progress: true, // 进度条显示
    compress: false, // gzip 压缩
    open: false // 运行后打开浏览器
  }
}