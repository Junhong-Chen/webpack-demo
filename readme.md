## webpack本地安装
- webpack、webpack-cli

## webpack配置
- 默认配置文件名: webpack.config.js。这个文件名在 node_modules\webpack-cli\bin\config\config-yargs.js 中被解析，也可以自定义文件名，然后在运行命令时指定它: "npx webpack --config 文件名"
- entry(入口)
- output(出口)
- loader
- plugins(插件)
- mode(模式)

## webpack开发服务器
- webpack 内置了一个以express实现的静态服务器，它并不会生成真实的打包文件，只是生产一个内存中的打包
- 安装开发依赖: webpack-dev-server、html-webpack-plugin
- 运行: npx webpack-dev-server

## babel: es2015 to es5
- babel-loader、@babel/core、@babel/preset-env
- 一些实验性的功能需要额外的 plugin 来处理，比如 es2016 中新增的装饰器

## babel: 抽离 helper 函数
- @babel/plugin-transform-runtime、@babel/runtime(这个在生产环境中也需要使用)

## eslint: 校验代码
- eslint、eslint-loader
- 配置 .eslintrc.json 文件
- 仅当您使用 eslint 本身不支持的类型（流）或实验功能时，才需要使用babel-eslint

## 引入全局变量
- expose-loader: 将其暴露在 window 对象上
- providePlugin: 自动加载模块，类型全局 mixin
- 使用 CDN，然后在 webpack 中忽略这个模块(目的是防止已经使用了 CDN 引入后，还在代码中额外引入)

## 处理图片
- 在js中: file-loader 会生成一张以 hash 命名的图片，并打包到 build 目录下。如果希望将较小的图片转成 base64 来减少请求，可以使用 url-loader，如果图片不满足转 base64 的要求，它会继续使用 file-loader 来解析，也就是说它自身包含了 file-loader，也更建议直接使用它(url-loader)
- 在css中: css-loader 会将 url() 中的路径转成 require() 的形式引入
- 在html中: html-withimg-loader 或 html-loader 会解析 html 中 img 的路径

## 资源文件打包分类
- image: url-loader
- css: mini-css-extract-plugin

## 多页面应用打包
- html: html-webpack-plugin

## 源码映射
- 解决压缩代码后无法找到代码报错位置的问题

## watch
- 监听文件的变化，当它们修改后会重新编译
- 模式默认是关闭的，不过在 webpack-dev-server 和 webpack-dev-middleware 里 watch 模式默认开启

## 常用插件
- clean-webpack-plugin: 每次构建前清理指定文件夹，比如 /dist
- copy-webpack-plugin: 将单个文件或整个目录复制到构建目录下
- BannerPlugin(内置): 为每个 chunk 文件头部添加 banner

## 跨域
- dev-server 提供了 proxy，详细用法请查阅其文档: https://github.com/chimurai/http-proxy-middleware#options
- dev-server 提供了 before 来添加自定义中间件
- webpack-dev-middleware: 让客户端和服务端运行在同一个端口下

## 解析(resolve)
- 如何解析模块，常用选项:
- alias: 创建 import 或 require 的别名，来确保模块引入变得更简单
- extensions: 自动解析确定的扩展，能够使用户在引入模块时不带扩展
- modules: 告诉 webpack 解析模块时应该搜索的目录
- mainFields: 当从 npm 包中导入模块时（例如 import * as D3 from 'd3'），此选项将决定在 package.json 中使用哪个字段导入模块

## 环境变量
- DefinePlugin: 允许创建一个在编译时可以配置的全局常量
- webpack-merge: 合并配置对象

## webpack优化
- noParse: 防止 webpack 解析那些任何与给定正则表达式相匹配的文件
- IgnorePlugin: 在 import 或 require 调用时，防止生成正则表达式匹配的模块
- DllPlugin: DLLPlugin 和 DLLReferencePlugin 用某种方法实现了拆分 bundles，同时还大大提升了构建的速度