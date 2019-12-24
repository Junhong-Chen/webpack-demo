// webpack 是 node 写出来的，它要使用 node 的写法
const path = require('path') // 引入 path 模块
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSsExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production', // 打包模式，默认为production
  entry: './src/index.js', // 入口
  // entry: { // 多入口
  //   index: './src/index.js',
  //   demo: './src/demo.js'
  // },
  output: { // 出口
    filename: 'bundle.js', // 打包后的文件名。可添加hash戳，命名为: bundle.[hash].js；也可限制hash戳的长度，比如8位: bundle.[hash:8].js
    // filename: '[name].js', // 有多个出口打包时的命名, [name] 表示多个 js 文件的名称
    path: path.resolve(__dirname, 'dist'), // 打包后的文件路径，必须填写绝对路径，所以需要用到内置的path模块将相对路径解析成绝对路径。__dirname 为当前文件的绝对路径，也可以不填。
    publicPath: '' // 在所有资源被打包时加上一个路径前缀
  },
  module: {
    // loader的特点: 单一职责
    // loader加载顺序: 从右(下)到左(上)
    // rules中只有一个loader且不用配置参数时，use的值可以直接写一个字符串即可
    rules: [
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      // {
      //   test: /\.(png|jpg|gif)$/,
      //   use: {
      //     loader: 'file-loader',
      //     options: {
      //       esModule: false // 这里要申明不是 esModule
      //     }
      //   }
      // },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            esModule: false,
            limit: 100 * 1024, // 当图片大小小于 100kb 时转成 base64
            outputPath: 'img/', // 打包到 img 目录下
            publicPath: '' // 在图片被打包时加上一个路径前缀
          }
        }
      },
      // {
      //   test: require.resolve('jquery'),
      //   use: 'expose-loader?$' // 引用 jquery 时，将它设置为 window 对象上的 $ 属性
      // },
      {
        test: /\.js$/,
        enforce: 'pre', // pre 无视 loader 的顺序，优先加载；与之相反的是 post；默认是 normal
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
      },
      // chunks: ['index'] // 需要引入的 js 文件名，可写多个
    }),
    // new HtmlWebpackPlugin({ // 多页面就用多个 HtmlWebpackPlugin() 来产生多个 html 文件
    //   template: './src/demo.html',
    //   filename: 'demo.html',
    //   chunks: ['demo']
    // }),
    new MiniCSsExtractPlugin({ // 将css单独打包成一个文件
      filename: 'css/main.css', // 在css目录中生成 main.css
    }),
    new webpack.ProvidePlugin({ // 自动加载模块
      $: 'jquery' // 相当于在每个模块中都写了 import $ from 'jquery'
    }),
    new CleanWebpackPlugin(), // 构建时自动清除 output.path 中的文件，注意在开启 watch 后观察不到效果，因为 watch 会实时更新编译后的文件
    new CopyPlugin([ // 将单个文件或整个目录复制到构建目录下
      {
        from: 'static/img/vscode.png', // 需要复制的文件或文件夹的路径
        to: 'img/', // 放到 output.path 中的 img 目录下
      }
    ]),
    new webpack.BannerPlugin('make 2019 by Jay') // 为每个 chunk 文件头部添加 banner
  ],
  devServer: { // 开发服务器
    contentBase: './dist', // 静态服务的目录地址，正常来说目录下可能没有index.html文件，所以需要借助 HtmlWebpackPlugin 来生成一个入口文件，配置了这个插件后可以不填写这个字段
    port: 8080, // 端口
    progress: true, // 进度条显示
    compress: false, // gzip 压缩
    open: false, // 运行后打开浏览器
    // proxy: { // 跨域代理
    //   '/api': {
    //     target: 'http://localhost:3000/', // 以 /api 开头的请求，使用 http://localhost:3000 来访问
    //     pathRewrite: {"^/api" : ""} //  去掉 /api
    //   }
    // },
    before(app) { // 可以在这里写一些模拟数据
      app.get('/mock', function(req, res) {
        res.json({ 'before': '中间件' })
      })
    }
  },
  // 此选项控制是否生成，以及如何生成 source-map。reference-link: https://www.webpackjs.com/configuration/devtool/
  devtool: 'source-map', // 这个配置('source-map')会将整个 source map 作为一个单独的文件生成，在生成环境中不建议使用
  watch: false, // 编译时监听文件变化，实时更新编译后的文件
  watchOptions: {
    poll: 1000, // 每隔 1000 ms 检查一次变动
    aggregateTimeout: 500, // 在重新构建前增加延迟，也就是防抖，默认值是 300
    ignored: /node_modules/ // 忽略对这个文件的检查
  },
  externals: { // 忽略的模块(依赖)
    jquery: '$' // 不对 jquery 这个模块进行处理
  }
}