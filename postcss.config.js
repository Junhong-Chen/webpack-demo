module.exports = {
  plugins: [
    require('autoprefixer') // 给css添加浏览器前缀，可能需要还要配置其他选项，目前只看到给 animation 添加了一个 webkit 前缀。ps: 在 package.json 要配置 browserslist
  ]
}