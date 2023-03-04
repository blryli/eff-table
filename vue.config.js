const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: false,

  outputDir: './docs',
  publicPath: './',

  configureWebpack: {
    entry: {
      app: resolve('docs-src/main.js')
    },
    resolve: {
      alias: {
        '@': resolve('docs-src')
      }
    }
  },
  runtimeCompiler: true,

  chainWebpack: config => {
    config.module
      .rule('js')
      .include
      .add(resolve('docs-src'))

    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
  },

  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/style/imports.scss";`
      }
    }
  }
}
