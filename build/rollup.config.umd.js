import base, { name, file } from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    exports: 'named',
    name,
    file: file('umd'),
    format: 'umd'
  }
})

export default config
