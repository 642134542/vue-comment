// Vue.config.js 配置选项
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // 选项
  //基本路径
  publicPath: "./",
  //构建时的输出目录
  outputDir: "dist",
  //放置静态资源的目录
  assetsDir: "static",
  //html 的输出路径
  indexPath: "index.html",
  //文件名哈希
  filenameHashing: true,
  //用于多页配置，默认是 undefined
  pages: {
    index: {
      // page 的入口文件
      entry: 'src/main.js',
      // 模板文件
      template: 'public/index.html',
      // 在 dist/index.html 的输出文件
      filename: 'index.html',
      // 当使用页面 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Index Page',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
  },
  //是否在保存的时候使用 `eslint-loader` 进行检查。
  lintOnSave: true,
  //是否使用带有浏览器内编译器的完整构建版本

  runtimeCompiler: false,
  //babel-loader 默认会跳过 node_modules 依赖。
  transpileDependencies: [ /* string or regex */ ],
  //是否为生产环境构建生成 source map？
  productionSourceMap: true,
  //设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性。
  crossorigin: "",
  //在生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)。
  integrity: false,
  //调整内部的 webpack 配置
  chainWebpack: (config) => {
    // set svg-sprite-loader
    config.module
        .rule('svg')
        .exclude.add(resolve('src/icons'))
        .end()
    config.module
        .rule('icons')
        .test(/\.svg$/)
        .include.add(resolve('src/icons'))
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({
          symbolId: 'icon-[name]'
        })
        .end()
  },
  // 配置 webpack-dev-server 行为。

  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 8086,
    https: false,
    hotOnly: false,
    // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/cli-service.md#配置代理
    proxy: {
      '/api': {
        target: 'http://app.rmsdmedia.com',
        changeOrigin: true,
      },
      '/foo': {
        target: 'http://app.rmsdmedia.com',
      }

    }, // string | Object
  },

  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  // 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`

  // 在多核机器下会默认开启。

  parallel: require('os').cpus().length > 1,

  // PWA 插件的选项。

  // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli-plugin-pwa/README.md

  pwa: {},

  // 三方插件的选项

  pluginOptions: {

    // ...

  }

}
