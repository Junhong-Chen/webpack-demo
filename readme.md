## 本地安装webpack
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