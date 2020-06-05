module.exports = {
  presets: [
    [
      '@babel/env', {
        'modules': false
      }
    ]
  ],
  plugins: [
    'transform-vue-jsx',
    [
      'module-resolver',
      {
        'root': ['src/']
      }
    ]
  ]
}
