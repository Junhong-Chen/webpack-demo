// webpack 是 node 写出来的，它要使用 node 的写法
const path = require('path') // 引入path模块
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSsExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  mode: 'production', // 打包模式，默认为production
  entry: './src/index.js', //入口
  output: { // 出口
    filename: 'bundle.js', // 打包后的文件名。可添加hash戳，命名为: bundle.[hash].js；也可限制hash戳的长度，比如8位: bundle.[hash:8].js
    path: path.resolve(__dirname, 'dist') // 打包后的文件路径，必须填写绝对路径，所以需要用到内置的path模块将相对路径解析成绝对路径。__dirname 为当前文件的绝对路径，也可以不填。
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // loader的特点: 单一职责
        // loader加载顺序: 从右(下)到左(上)
        // 只有一个loader且不用配置参数时，use的值可以不用数组，直接写一个字符串即可
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
  optimization: { // 优化
    minimizer: [ // mode 改成 production 才会生效
      new TerserJSPlugin({}), // 使用 minimizer 选项时，必须也要加上这个插件才能压缩 js 文件
      new OptimizeCSSAssetsPlugin({}) // 压缩 css 文件
    ]
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