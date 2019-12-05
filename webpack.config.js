// webpack 是 node 写出来的，它要使用 node 的写法
const path = require('path') // 引入path模块
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSsExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  mode: 'development', // 打包模式，默认为production
  entry: './src/index.js', //入口
  output: { // 出口
    filename: 'bundle.js', // 打包后的文件名。可添加hash戳，命名为: bundle.[hash].js；也可限制hash戳的长度，比如8位: bundle.[hash:8].js
    path: path.resolve(__dirname, 'dist') // 打包后的文件路径，必须填写绝对路径，所以需要用到内置的path模块将相对路径解析成绝对路径。__dirname 为当前文件的绝对路径，也可以不填。
  },
  module: {
    // loader的特点: 单一职责
    // loader加载顺序: 从右(下)到左(上)
    // rules中只有一个loader且不用配置参数时，use的值可以直接写一个字符串即可
    rules: [
      {
        enforce: 'pre', // pre 无视 loader 的顺序，优先加载；与之相反的是 post；默认是 normal
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ // 预设，可以理解为插件集合
              '@babel/preset-env' // es2015 转 es5
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', { 'decoratorsBeforeExport': true }], // 装饰器是实验性功能，所以需要额外的插件对它专门做处理
              "@babel/plugin-transform-runtime" // 抽离 helper 函数进行复用，减小代码体积。除此之外，babel 还为源代码的非实例方法（Object.assign，实例方法是类似这样的 "foobar".includes("foo")）和 babel-runtime/helps 下的工具函数自动引用了 polyfill。这样避免了污染全局命名空间，非常适合于 JavaScript 库和工具包的实现。
            ]
          }
        },
        include: path.resolve(__dirname, 'src'), // 在什么地方找js文件
        exclude: /node_modules/ // 不在什么地方找js文件
      },
      {
        test: /\.css$/,
        use: [
          MiniCSsExtractPlugin.loader, // 将css打包成一个文件，并以link的形式插入到<head></head>中
          'css-loader', // 解释(interpret) @import 和 url()
          'postcss-loader' // 用js处理css，需要配置 postcss.config.js 文件。介绍：https://www.ibm.com/developerworks/cn/web/1604-postcss-css/index.html
        ]
      },
      {
        test: /\.scss$/,
        // 处理sass/scss: node-sass、sass-loader
        // 处理less: less、less-loader
        // 处理stylus: stylus、stylus-loader
        use: [
          {
            loader: 'style-loader', // 将样式抽离成<style></style>，并插入到<head></head>中
            options: {
              // insert: 'head' // 默认将样式插入到head的尾部
              insert: function insertAtTop(element) { // 插入到head的顶部
                var parent = document.querySelector('head');
                var lastInsertedElement = window._lastElementInsertedByStyleLoader;

                if (!lastInsertedElement) {
                  parent.insertBefore(element, parent.firstChild);
                } else if (lastInsertedElement.nextSibling) {
                  parent.insertBefore(element, lastInsertedElement.nextSibling);
                } else {
                  parent.appendChild(element);
                }

                window._lastElementInsertedByStyleLoader = element;
              }
            }
          },
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  // optimization: { // 优化
  //   minimizer: [ // mode 改成 production 才会生效
  //     new TerserJSPlugin({}), // 使用 minimizer 选项时，必须也要加上这个插件才能压缩 js 文件
  //     new OptimizeCSSAssetsPlugin({}) // 压缩 css 文件
  //   ]
  // },
  plugins: [ // 插件
    new HtmlWebpackPlugin({ // 生成一个开发服务用的入口文件
      template: './src/index.html', // 生成入口文件所需要参考的模板
      filename: 'index.html', // 入口文件的文件名，可不填
      hash: true, // 添加hash戳，避免用户依然加缓存中的旧文件
      minify: { // 打包压缩配置项
        removeAttributeQuotes: true, // 删除属性的双引号
        collapseWhitespace: true // 折叠空行
      }
    }),
    new MiniCSsExtractPlugin({ // 将css单独打包成一个文件
      filename: 'main.css', // 文件名
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