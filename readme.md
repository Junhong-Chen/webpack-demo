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
- 安装开发依赖: webpack-dve-server、html-webpack-plugin
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
- (1)expose-loader: 将其暴露在 window 对象上
- (2)providePlugin: 自动加载模块，类型全局 mixin
- (3)使用 CDN，然后在 webpack 中忽略这个模块(目的是防止已经使用了 CDN 引入后，还在代码中额外引入)