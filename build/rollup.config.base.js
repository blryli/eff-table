import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import vue from 'rollup-plugin-vue'
import sass from 'rollup-plugin-sass'

const config = require('../package.json')

const { name } = config
const file = type => `dist/${name}.${type}.js`

export { name, file }

export default {
  input: 'src/index.js',
  plugins: [
    resolve({
      mainFields: ['module', 'jsnext:main', 'main', 'browser'],
      extensions: ['.js, .vue']
    }),
    vue({
      css: false,
      scss: false
    }),
    sass({
      output: `${name}.css`
    }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      extensions: ['.js', '.vue']
    })
  ],
  watch: {
    include: 'src/**'
  }
}
