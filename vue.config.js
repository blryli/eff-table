const path = require('path')

module.exports = {
  lintOnSave: process.env.NODE_ENV === 'development',

  outputDir: './docs',
  publicPath: './',

  configureWebpack: {
    entry: {
      app: path.resolve(__dirname, './docs-src/main.js')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './docs-src')
      }
    }
  },

  chainWebpack: config => {
    config.module
      .rule('js')
      .include
      .add(path.resolve(__dirname, './docs-src'))
  },

  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/style/imports.scss";`
      }
    }
  }
}
